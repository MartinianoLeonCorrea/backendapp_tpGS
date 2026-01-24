import { orm } from '../../config/mikro-orm';
import { Materia } from './materia.entity';

class MateriaService {
  // Helper para obtener el EntityManager
  private get em() {
    return orm.em.fork();
  }

  // ========================= CREATE =========================
  async createMateria(materiaData: { nombre: string; descripcion?: string }) {
    try {
      if (!materiaData.nombre || materiaData.nombre.trim() === '') {
        throw new Error('El nombre de la materia es requerido.');
      }

      const em = this.em;
      
      const newMateria = em.create(Materia, {
        nombre: materiaData.nombre.trim(),
        descripcion: materiaData.descripcion?.trim() || undefined,
        createdAt: '',
        updatedAt: ''
      });

      await em.persistAndFlush(newMateria);
      return newMateria;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe una materia con ese nombre.');
      }
      throw new Error('Error al crear materia: ' + error.message);
    }
  }

  // ========================= READ ===========================
  async findAllMaterias(options: {
    page?: number;
    limit?: number;
    search?: string;
    includeRelations?: boolean;
  } = {}) {
    try {
      const { page, limit, search, includeRelations = false } = options;
      const em = this.em;

      const queryOptions: any = {
        orderBy: { nombre: 'ASC' },
      };

      // Paginación
      if (page && limit) {
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit;
      }

      // Búsqueda
      const where: any = {};
      if (search) {
        where.nombre = { $like: `%${search}%` };
      }

      // Incluir relaciones
      if (includeRelations) {
        queryOptions.populate = ['dictados'];
      }

      const materias = await em.find(Materia, where, queryOptions);
      return materias;
    } catch (error: any) {
      throw new Error('Error al obtener todas las materias: ' + error.message);
    }
  }

  async findMateriaById(id: number, includeRelations = false) {
    try {
      if (!this._validateId(id)) {
        throw new Error('ID inválido');
      }

      const em = this.em;
      const queryOptions: any = {};

      if (includeRelations) {
        queryOptions.populate = ['dictados'];
      }

      const materia = await em.findOne(Materia, { id }, queryOptions);
      return materia;
    } catch (error: any) {
      throw new Error('Error al obtener materia por ID: ' + error.message);
    }
  }

  // ========================= UPDATE =========================
  async updateMateria(id: number, materiaData: { nombre?: string; descripcion?: string }) {
    try {
      if (!this._validateId(id)) {
        throw new Error('ID inválido');
      }

      if (!materiaData.nombre || materiaData.nombre.trim() === '') {
        throw new Error('El nombre de la materia es requerido.');
      }

      const em = this.em;
      const materia = await em.findOne(Materia, { id });

      if (!materia) {
        return null;
      }

      // Actualizar campos
      materia.nombre = materiaData.nombre.trim();
      materia.descripcion = materiaData.descripcion?.trim() || undefined;

      await em.flush();
      return materia;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe una materia con ese nombre.');
      }
      throw new Error('Error al actualizar materia: ' + error.message);
    }
  }

  // ========================= DELETE =========================
  async deleteMateria(id: number) {
    try {
      if (!this._validateId(id)) {
        throw new Error('ID inválido');
      }

      const em = this.em;
      const materia = await em.findOne(Materia, { id });

      if (!materia) {
        return false;
      }

      await em.removeAndFlush(materia);
      return true;
    } catch (error: any) {
      throw new Error('Error al eliminar materia: ' + error.message);
    }
  }

  // ========================= COUNT =========================
  async countMaterias(search?: string) {
    try {
      const em = this.em;
      const where: any = {};

      if (search) {
        where.nombre = { $like: `%${search}%` };
      }

      return await em.count(Materia, where);
    } catch (error: any) {
      throw new Error('Error al contar materias: ' + error.message);
    }
  }

  // ========================= HELPER FUNCTIONS ===========================
  _successResponse(message: string, data: any) {
    return {
      success: true,
      message,
      data,
    };
  }

  _errorResponse(message: string, errors: string[] = []) {
    return {
      success: false,
      message,
      errors,
    };
  }

  _buildPaginationMeta(page: number, limit: number, totalCount: number) {
    const totalPages = Math.ceil(totalCount / limit);
    return {
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  _validateId(id: any): boolean {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
  }
}

export default new MateriaService();