import { EntityManager, wrap } from '@mikro-orm/core';
import { orm } from '../../config/mikro-orm';
import { Materia } from './materia.entity';

class MateriaService {
  // Helper para obtener el EntityManager
  private get em(): EntityManager {
    return orm.em.fork();
  }

  // ========================= CREATE =========================
  async createMateria(data: { nombre: string; descripcion?: string }) {
    try {
      const em = this.em;
      const newMateria = em.create(Materia, {
        nombre: data.nombre.trim(),
        descripcion: data.descripcion?.trim(),
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
  }) {
    try {
      const { page, limit, search, includeRelations } = options;
      const em = this.em;
      const where: any = {};

      if (search) {
        where.nombre = { $ilike: `%${search}%` };
      }

      return await em.find(Materia, where, {
        orderBy: { nombre: 'ASC' },
        limit: limit,
        offset: page && limit ? (page - 1) * limit : undefined,
        populate: includeRelations ? (['dictados'] as any) : [],
      });
    } catch (error: any) {
      throw new Error('Error al obtener todas las materias: ' + error.message);
    }
  }

  async findMateriaById(id: number, includeRelations: boolean = false) {
    try {
      return await this.em.findOne(Materia, { id }, {
        populate: includeRelations ? (['dictados'] as any) : []
      });
    } catch (error: any) {
      throw new Error('Error al obtener materia por ID: ' + error.message);
    }
  }

  // ========================= UPDATE =========================
  async updateMateria(id: number, data: { nombre?: string; descripcion?: string }) {
    try {
      const em = this.em;
      const materia = await em.findOne(Materia, { id });

      if (!materia) return null;

      wrap(materia).assign({
        nombre: data.nombre?.trim(),
        descripcion: data.descripcion?.trim(),
      });

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
      const em = this.em;
      const materia = await em.findOne(Materia, { id });
      
      if (!materia) return false;

      await em.removeAndFlush(materia);
      return true;
    } catch (error: any) {
      throw new Error('Error al eliminar materia: ' + error.message);
    }
  }

  // ========================= COUNT =========================
  async countMaterias(search?: string) {
    try {
      const where = search ? { nombre: { $ilike: `%${search}%` } } : {};
      return await this.em.count(Materia, where);
    } catch (error: any) {
      throw new Error('Error al contar materias: ' + error.message);
    }
  }

  // ========================= HELPER FUNCTIONS ===========================
  _successResponse(message: string, data: any) {
    return { success: true, message, data };
  }

  _errorResponse(message: string, errors: string[] = []) {
    return { success: false, message, errors };
  }

  _buildPaginationMeta(page: number, limit: number, totalCount: number) {
    return {
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      itemsPerPage: limit,
    };
  }
}

export default new MateriaService();