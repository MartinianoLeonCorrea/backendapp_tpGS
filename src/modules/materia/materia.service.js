const Materia = require('./materia.model');
const Dictado = require('./dictado.model');
const Examen = require('./examen.model');
const { Op } = require('sequelize');

class MateriaService {

    // ========================= CREATE =========================

    // Crear una nueva materia

    async createMateria(materiaData) {
        try {

            // Validación adicional de negocio

            if (!materiaData.nombre || materiaData.nombre.trim() === '') {
                throw new Error('El nombre de la materia es requerido.');
            }

            const newMateria = await Materia.create({
                nombre: materiaData.nombre.trim(),
                descripcion: materiaData.descripcion?.trim() || null
            });
            
            return newMateria;
        } catch (error) {
            this._handleSequelizeError(error, 'crear materia');
        }
    }

    // ========================= READ ===========================

    // Obtener todas las materias

    async findAllMaterias(options = {}) {
        try {
            const { page, limit, search, includeRelations = false } = options;
            
            let queryOptions = {
                order: [['nombre', 'ASC']],
            };

            // Paginación

            if (page && limit) {
                const offset = (page - 1) * limit;
                queryOptions.limit = parseInt(limit);
                queryOptions.offset = offset;
            }

            // Búsqueda por nombre

            if (search) {
                queryOptions.where = {
                    nombre: {
                        [Op.iLike]: `%${search}%`
                    }
                };
            }

            // Incluir relaciones si se solicita

            if (includeRelations) {
                queryOptions.include = this._getRelationIncludes();
            }

            const materias = await Materia.findAll(queryOptions);
            return materias;
        } catch (error) {
            throw new Error('Error al obtener todas las materias: ' + error.message);
        }
    }

    // Obtener una materia por ID

    async findMateriaById(id, includeRelations = false) {
        try {
            this._validateId(id);

            let queryOptions = {
                where: { id }
            };

            if (includeRelations) {
                queryOptions.include = this._getRelationIncludes();
            }

            const materia = await Materia.findOne(queryOptions);
            return materia;
        } catch (error) {
            throw new Error('Error al obtener materia por ID: ' + error.message);
        }
    }

    // ========================= UPDATE =========================

    // Actualizar una materia

    async updateMateria(id, materiaData) {
        try {
            this._validateId(id);

            // Validación de datos

            if (!materiaData.nombre || materiaData.nombre.trim() === '') {
                throw new Error('El nombre de la materia es requerido.');
            }

            // Verificar que la materia existe

            const existingMateria = await Materia.findByPk(id);
            if (!existingMateria) {
                return null;
            }

            const updateData = {
                nombre: materiaData.nombre.trim(),
                descripcion: materiaData.descripcion?.trim() || null
            };

            const [updatedRows] = await Materia.update(updateData, {
                where: { id: id }
            });

            if (updatedRows > 0) {
                return await Materia.findByPk(id);
            }
            
            return null;
        } catch (error) {
            this._handleSequelizeError(error, 'actualizar materia');
        }
    }

    // ========================= DELETE =========================

    // Eliminar una materia

    async deleteMateria(id) {
        try {
            this._validateId(id);

            // Verificar si puede ser eliminada
            
            const verification = await this.canDeleteMateria(id);
            if (!verification.canDelete) {
                throw new Error(`No se puede eliminar la materia: ${verification.reasons.join(', ')}`);
            }

            const deletedRows = await Materia.destroy({
                where: { id: id }
            });
            
            return deletedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar materia: ' + error.message);
        }
    }
}

module.exports = MateriaService;