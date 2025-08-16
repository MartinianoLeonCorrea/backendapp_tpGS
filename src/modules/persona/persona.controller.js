const PersonaService = require('./persona.service');

class PersonaController {

    // ========================= CREATE =========================

    // Crear un alumno

    static async createAlumno(req, res, next) {
        try {
            const alumnoData = req.body;
            const { cursoId } = req.body;

            // Validaciones básicas

            if (!alumnoData.dni || !alumnoData.nombre || !alumnoData.apellido) {
                return res.status(400).json({
                    message: 'Los campos dni, nombre y apellido son obligatorios'
                });
            }

            const newAlumno = await PersonaService.createAlumno(alumnoData, cursoId);
            res.status(201).json({
                message: 'Alumno creado exitosamente',
                data: newAlumno
            });
        } catch (error) {
            next(error);
        }
    }

    // Crear un docente

    static async createDocente(req, res, next) {
        try {
            const docenteData = req.body;

            // Validaciones básicas

            if (!docenteData.dni || !docenteData.nombre || !docenteData.apellido) {
                return res.status(400).json({
                    message: 'Los campos dni, nombre y apellido son obligatorios'
                });
            }

            // Verificar que no incluya cursoId

            if (docenteData.cursoId) {
                return res.status(400).json({
                    message: 'Los docentes no pueden tener curso asignado'
                });
            }

            const newDocente = await PersonaService.createDocente(docenteData);
            res.status(201).json({
                message: 'Docente creado exitosamente',
                data: newDocente
            });
        } catch (error) {
            next(error);
        }
    }

    // ========================= READ ===========================
    
    // Obtener todas las personas

    static async getAllPersonas(req, res, next) {
        try {
            const { tipoCodigo, includeCurso, includeDictados } = req.query;
            const options = {
                tipoCodigo,
                includeCurso: includeCurso === 'true',
                includeDictados: includeDictados === 'true'
            };

            const personas = await PersonaService.findAllPersonas(options);
            res.status(200).json({
                message: 'Personas obtenidas exitosamente',
                data: personas,
                count: personas.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener persona por DNI

    static async getPersonaByDni(req, res, next) {
        try {
            const { dni } = req.params;
            const { includeCurso, includeDictados } = req.query;

            const options = {
                includeCurso: includeCurso === 'true',
                includeDictados: includeDictados === 'true'
            };

            const persona = await PersonaService.findPersonaByDni(parseInt(dni), options);

            if (!persona) {
                return res.status(404).json({ message: 'Persona no encontrada' });
            }

            res.status(200).json({
                message: 'Persona obtenida exitosamente',
                data: persona
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener todos los alumnos

    static async getAllAlumnos(req, res, next) {
        try {
            const { cursoId, includeCurso } = req.query;
            const options = {
                cursoId: cursoId ? parseInt(cursoId) : undefined,
                includeCurso: includeCurso !== 'false' // Por defecto true
            };

            const alumnos = await PersonaService.findAllAlumnos(options);
            res.status(200).json({
                message: 'Alumnos obtenidos exitosamente',
                data: alumnos,
                count: alumnos.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener todos los docentes

    static async getAllDocentes(req, res, next) {
        try {
            const { includeDictados, especialidad } = req.query;
            const options = {
                includeDictados: includeDictados === 'true',
                especialidad
            };

            const docentes = await PersonaService.findAllDocentes(options);
            res.status(200).json({
                message: 'Docentes obtenidos exitosamente',
                data: docentes,
                count: docentes.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Buscar personas por nombre

    static async searchByName(req, res, next) {
        try {
            const { q } = req.query;

            if (!q || q.length < 2) {
                return res.status(400).json({
                    message: 'El término de búsqueda debe tener al menos 2 caracteres'
                });
            }

            const personas = await PersonaService.searchByName(q);
            res.status(200).json({
                message: 'Búsqueda completada exitosamente',
                data: personas,
                count: personas.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener alumnos por curso

    static async getAlumnosByCurso(req, res, next) {
        try {
            const { cursoId } = req.params;
            const alumnos = await PersonaService.findAlumnosByCurso(parseInt(cursoId));

            res.status(200).json({
                message: 'Alumnos del curso obtenidos exitosamente',
                data: alumnos,
                count: alumnos.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener docentes por dictado

    static async getDocentesByDictado(req, res, next) {
        try {
            const { dictadoId } = req.params;
            const docentes = await PersonaService.findDocentesByDictado(parseInt(dictadoId));

            res.status(200).json({
                message: 'Docentes del dictado obtenidos exitosamente',
                data: docentes,
                count: docentes.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener estadísticas

    static async getEstadisticas(req, res, next) {
        try {
            const stats = await PersonaService.getEstadisticas();
            res.status(200).json({
                message: 'Estadísticas obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    // ========================= UPDATE =========================

    // Actualizar una persona

    static async updatePersona(req, res, next) {
        try {
            const { dni } = req.params;
            const personaData = req.body;

            const updatedPersona = await PersonaService.updatePersona(parseInt(dni), personaData);

            if (!updatedPersona) {
                return res.status(404).json({ message: 'Persona no encontrada' });
            }

            res.status(200).json({
                message: 'Persona actualizada exitosamente',
                data: updatedPersona
            });
        } catch (error) {
            next(error);
        }
    }

    // Asignar dictado a docente

    static async asignarDictadoADocente(req, res, next) {
        try {
            const { dni, dictadoId } = req.params;
            
            await PersonaService.asignarDictadoADocente(parseInt(dni), parseInt(dictadoId));
            
            res.status(200).json({
                message: 'Dictado asignado al docente exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    // Cambiar curso de alumno

    static async asignarCursoAlumno(req, res, next) {
        try {
            const { dni } = req.params;
            const { cursoId } = req.body;

            const alumnoActualizado = await PersonaService.asignarCursoAlumno(parseInt(dni), parseInt(cursoId));

            res.status(200).json({
                message: 'Curso del alumno asignado exitosamente',
                data: alumnoActualizado
            });
        } catch (error) {
            next(error);
        }
    }

    // ========================= DELETE =========================
    
    // Eliminar una persona

    static async deletePersona(req, res, next) {
        try {
            const { dni } = req.params;
            const deletedPersona = await PersonaService.deletePersona(parseInt(dni));

            if (!deletedPersona) {
                return res.status(404).json({ message: 'Persona no encontrada' });
            }

            res.status(200).json({ 
                message: 'Persona eliminada exitosamente' 
            });
        } catch (error) {
            next(error);
        }
    }

    // Remover dictado de docente

    static async removerDictadoDeDocente(req, res, next) {
        try {
            const { dni, dictadoId } = req.params;
            
            await PersonaService.removerDictadoDeDocente(parseInt(dni), parseInt(dictadoId));
            
            res.status(200).json({
                message: 'Dictado removido del docente exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

// Remover curso de alumno

    static async removerCursoDeAlumno(req, res, next) {
        try {
            const { dni, cursoId } = req.params;
            
            await PersonaService.removerCursoDeAlumno(parseInt(dni), parseInt(cursoId));
            
            res.status(200).json({
                message: 'Curso removido del alumno exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }    
}

module.exports = PersonaController;