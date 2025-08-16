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

    // Crear un docente (NO puede tener curso)

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

    // Buscar personas por nombre o apellido

    static async searchByName(searchTerm) {
        try {
            const personas = await Persona.findAll({
                where: {
                    [Op.or]: [
                        {
                            nombre: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                        {
                            apellido: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: Curso,
                        as: 'curso',
                        attributes: ['id', 'anio_letra', 'turno']
                    }
                ],
                order: [['apellido', 'ASC'], ['nombre', 'ASC']]
            });

            return personas;
        } catch (error) {
            throw new Error('Error al buscar personas por nombre: ' + error.message);
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

    // Obtener docentes por dictado

    static async findDocentesByDictado(dictadoId) {
        try {
            const docentes = await Persona.findAll({
                where: {
                    tipoCodigo: 'Docente'
                },
                include: [
                    {
                        model: Dictado,
                        as: 'dictados',
                        where: { id: dictadoId },
                        through: { attributes: [] }
                    }
                ],
                order: [['apellido', 'ASC'], ['nombre', 'ASC']]
            });

            return docentes;
        } catch (error) {
            throw new Error('Error al obtener docentes por dictado: ' + error.message);
        }
    }

    // Obtener estadísticas generales

    static async getEstadisticas() {
        try {
            const totalPersonas = await Persona.count();
            const totalAlumnos = await Persona.count({ 
                where: { tipoCodigo: 'Alumno' } 
            });
            const totalDocentes = await Persona.count({ 
                where: { tipoCodigo: 'Docente' } 
            });

            // Estadísticas por curso (solo alumnos)

            const alumnosPorCurso = await Persona.findAll({
                where: { tipoCodigo: 'Alumno' },
                attributes: [
                    'cursoId',
                    [sequelize.fn('COUNT', sequelize.col('dni')), 'cantidad']
                ],
                include: [
                    {
                        model: Curso,
                        as: 'curso',
                        attributes: ['anio_letra', 'turno']
                    }
                ],
                group: ['cursoId', 'curso.id'],
                raw: false
            });

            return {
                totalPersonas,
                totalAlumnos,
                totalDocentes,
                alumnosPorCurso
            };
        } catch (error) {
            throw new Error('Error al obtener estadísticas: ' + error.message);
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

    // Asignar dictado a docente

    static async asignarDictadoADocente(docenteDni, dictadoId) {
        try {
            const docente = await Persona.findOne({
                where: {
                    dni: docenteDni,
                    tipoCodigo: 'Docente'
                }
            });

            if (!docente) {
                throw new Error('Docente no encontrado');
            }

            const dictado = await Dictado.findByPk(dictadoId);
            if (!dictado) {
                throw new Error('Dictado no encontrado');
            }

            await docente.addDictado(dictado);
            return true;
        } catch (error) {
            throw new Error('Error al asignar dictado a docente: ' + error.message);
        }
    }

    // Cambiar curso de un alumno

    static async asignarCursoAlumno(alumnoDni, nuevoCursoId) {
        try {
            const alumno = await Persona.findOne({
                where: {
                    dni: alumnoDni,
                    tipoCodigo: 'Alumno'
                }
            });

            if (!alumno) {
                throw new Error('Alumno no encontrado');
            }

            const curso = await Curso.findByPk(nuevoCursoId);
            if (!curso) {
                throw new Error('Curso no encontrado');
            }

            return await PersonaService.updatePersona(alumnoDni, { cursoId: nuevoCursoId });
        } catch (error) {
            throw new Error('Error al cambiar curso del alumno: ' + error.message);
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

    // Remover dictado de docente

    static async removerDictadoDeDocente(docenteDni, dictadoId) {
        try {
            const docente = await Persona.findOne({
                where: {
                    dni: docenteDni,
                    tipoCodigo: 'Docente'
                }
            });

            if (!docente) {
                throw new Error('Docente no encontrado');
            }

            const dictado = await Dictado.findByPk(dictadoId);
            if (!dictado) {
                throw new Error('Dictado no encontrado');
            }

            await docente.removeDictado(dictado);
            return true;
        } catch (error) {
            throw new Error('Error al remover dictado del docente: ' + error.message);
        }
    }

    // Remover curso de alumno

    static async removerCursoDeAlumno(alumnoDni, CursoId) {
        try {
            const alumno = await Persona.findOne({
                where: {
                    dni: alumnoDni,
                    tipoCodigo: 'Alumno'
                }
            });

            if (!alumno) {
                throw new Error('Alumno no encontrado');
            }

            const curso = await Curso.findByPk(CursoId);
            if (!curso) {
                throw new Error('Curso no encontrado');
            }

            await alumno.removeCurso(curso);
            return true;
        } catch (error) {
            throw new Error('Error al remover curso del alumno: ' + error.message);
        }
    }    
}

module.exports = PersonaService;