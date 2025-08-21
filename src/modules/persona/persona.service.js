const { Op } = require('sequelize');
const Persona = require('./persona.model');
const Curso = require('../curso/curso.model');
const Dictado = require('../dictado/dictado.model');
const Materia = require('../materia/materia.model');

class PersonaService {

    // ========================= CREATE =========================
    
    // Crear un alumno 

    static async createAlumno(alumnoData, cursoId = null) {
        try {
            const alumnoCompleto = {
                ...alumnoData,
                tipoCodigo: 'Alumno',
                cursoId: cursoId
            };
            const newAlumno = await Persona.create(alumnoCompleto);
            return newAlumno;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Ya existe una persona con ese DNI o email.');
            }
            if (error.name === 'SequelizeValidationError') {
                throw new Error(
                    'Error de validación: ' + error.errors.map((e) => e.message).join(', ')
                );
            }
            throw new Error('Error al crear alumno: ' + error.message);
        }
    }

    // Crear un docente 

    static async createDocente(docenteData) {
        try {
            const docenteCompleto = {
                ...docenteData,
                tipoCodigo: 'Docente',
                cursoId: null // Siempre null para docentes
            };

            const newDocente = await Persona.create(docenteCompleto);
            return newDocente;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Ya existe una persona con ese DNI o email.');
            }
            if (error.name === 'SequelizeValidationError') {
                throw new Error(
                    'Error de validación: ' + error.errors.map((e) => e.message).join(', ')
                );
            }
            throw new Error('Error al crear docente: ' + error.message);
        }
    }

    // ========================= READ ===========================
    
    // Obtener todas las personas

    static async findAllPersonas(options = {}) {
        try {
            const { tipoCodigo, includeCurso = false, includeDictados = false } = options;
            const where = {};
            const include = [];

            // Filtrar por tipo si se especifica

            if (tipoCodigo) {
                where.tipoCodigo = tipoCodigo;
            }

            // Incluir curso si se solicita

            if (includeCurso) {
                include.push({
                    model: Curso,
                    as: 'curso',
                    attributes: ['id', 'anio_letra', 'turno']
                });
            }

            // Incluir dictados si se solicita (solo para docentes)

            if (includeDictados) {
                include.push({
                    model: Dictado,
                    as: 'dictados',
                    through: { attributes: [] },
                    attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado'],
                    include: [
                        {
                            model: Curso,
                            as: 'curso',
                            attributes: ['id', 'anio_letra', 'turno']
                        }
                    ]
                });
            }

            const personas = await Persona.findAll({
                where,
                include,
                order: [['apellido', 'ASC'], ['nombre', 'ASC']]
            });

            return personas;
        } catch (error) {
            throw new Error('Error al obtener todas las personas: ' + error.message);
        }
    }

    // Encontrar persona por DNI

    static async findPersonaByDni(dni, options = {}) {
        try {
            const { includeCurso = false, includeDictados = false } = options;
            const include = [];

            if (includeCurso) {
                include.push({
                    model: Curso,
                    as: 'curso'
                });
            }

            if (includeDictados) {
                include.push({
                    model: Dictado,
                    as: 'dictados',
                    through: { attributes: [] },
                    include: [
                        {
                            model: Curso,
                            as: 'curso'
                        },
                        {
                            model: Materia,
                            as: 'materias',
                            through: { attributes: [] }
                        }
                    ]
                });
            }

            const persona = await Persona.findByPk(dni, { include });
            return persona;
        } catch (error) {
            throw new Error('Error al obtener persona por DNI: ' + error.message);
        }
    }

    // Obtener solo alumnos

    static async findAllAlumnos(options = {}) {
        try {
            const { cursoId, includeCurso = true } = options;
            const where = { tipoCodigo: 'Alumno' };
            const include = [];

            // Filtrar por curso si se especifica

            if (cursoId) {
                where.cursoId = cursoId;
            }

            // Incluir información del curso por defecto

            if (includeCurso) {
                include.push({
                    model: Curso,
                    as: 'curso'
                });
            }

            const alumnos = await Persona.findAll({
                where,
                include,
                order: [['apellido', 'ASC'], ['nombre', 'ASC']]
            });

            return alumnos;
        } catch (error) {
            throw new Error('Error al obtener alumnos: ' + error.message);
        }
    }

    // Obtener solo docentes

    static async findAllDocentes(options = {}) {
        try {
            const { includeDictados = false, especialidad } = options;
            const where = { tipoCodigo: 'Docente' };
            const include = [];

            // Filtrar por especialidad si se especifica

            if (especialidad) {
                where.especialidad = especialidad;
            }

            // Incluir dictados si se solicita

            if (includeDictados) {
                include.push({
                    model: Dictado,
                    as: 'dictados',
                    through: { attributes: [] },
                    include: [
                        {
                            model: Curso,
                            as: 'curso'
                        },
                        {
                            model: Materia,
                            as: 'materias',
                            through: { attributes: [] }
                        }
                    ]
                });
            }

            const docentes = await Persona.findAll({
                where,
                include,
                order: [['apellido', 'ASC'], ['nombre', 'ASC']]
            });

            return docentes;
        } catch (error) {
            throw new Error('Error al obtener docentes: ' + error.message);
        }
    }

    // Obtener alumnos por curso

    static async findAlumnosByCurso(cursoId) {
        try {
            const alumnos = await Persona.findAll({
                where: {
                    tipoCodigo: 'Alumno',
                    cursoId: cursoId
                },
                include: [
                    {
                        model: Curso,
                        as: 'curso'
                    }
                ],
                order: [['apellido', 'ASC'], ['nombre', 'ASC']]
            });

            return alumnos;
        } catch (error) {
            throw new Error('Error al obtener alumnos por curso: ' + error.message);
        }
    }

    // ========================= UPDATE =========================
    
    // Actualizar una persona

    static async updatePersona(dni, personaData) {
        try {
            const [updatedRows] = await Persona.update(personaData, {
                where: { dni: dni }
            });

            if (updatedRows > 0) {
                return await Persona.findByPk(dni);
            }
            return null;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Ya existe una persona con ese DNI o email.');
            }
            if (error.name === 'SequelizeValidationError') {
                throw new Error(
                    'Error de validación: ' + error.errors.map((e) => e.message).join(', ')
                );
            }
            throw new Error('Error al actualizar persona: ' + error.message);
        }
    }

    // ========================= DELETE =========================
    
    // Eliminar una persona

    static async deletePersona(dni) {
        try {
            const persona = await Persona.findByPk(dni);
            if (!persona) {
                return false;
            }

            // Si es docente, remover relaciones con dictados

            if (persona.tipoCodigo === 'Docente') {
                await persona.setDictados([]);
            }

            const deletedRows = await Persona.destroy({
                where: { dni: dni }
            });

            return deletedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar persona: ' + error.message);
        }
    }
}

module.exports = PersonaService;