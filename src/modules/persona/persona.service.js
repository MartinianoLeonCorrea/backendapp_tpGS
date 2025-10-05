// src/modules/persona/persona.service.js - REEMPLAZAR TODO EL ARCHIVO

const { Op } = require('sequelize');
const Persona = require('./persona.model');
const Curso = require('../curso/curso.model');
const Dictado = require('../dictado/dictado.model');
const Evaluacion = require('../evaluacion/evaluacion.model'); // Asumiendo que existe para chequeo de dependientes
const Materia = require('../materia/materia.model');

class PersonaService {
  // ========================= HELPERS DE VALIDACIÓN (PRIVADOS) =========================
  // Validar datos para crear alumno (retorna { isValid, errors })
  static _validateCreateAlumnoData(data) {
    const errors = [];
    let isValid = true;

    // DNI: Entero, 7-8 dígitos (1.000.000 - 99.999.999)
    if (
      !data.dni ||
      isNaN(data.dni) ||
      data.dni < 1000000 ||
      data.dni > 99999999
    ) {
      errors.push(
        'El DNI debe ser un número entero entre 1,000,000 y 99,999,999.'
      );
      isValid = false;
    }

    // Nombre y Apellido: No vacío, 2-100 chars
    if (
      !data.nombre ||
      data.nombre.trim().length < 2 ||
      data.nombre.trim().length > 100
    ) {
      errors.push('El nombre debe tener entre 2 y 100 caracteres.');
      isValid = false;
    }
    if (
      !data.apellido ||
      data.apellido.trim().length < 2 ||
      data.apellido.trim().length > 100
    ) {
      errors.push('El apellido debe tener entre 2 y 100 caracteres.');
      isValid = false;
    }

    // Email: Formato válido y no vacío
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.push(
        'El email debe tener un formato válido (ej: usuario@dominio.com).'
      );
      isValid = false;
    }

    // Teléfono: No vacío, solo dígitos, espacios, -, +, (, )
    if (!data.telefono || !/^[\d\s\-\+\(\)]+$/.test(data.telefono.trim())) {
      errors.push(
        'El teléfono debe contener solo números, espacios, guiones, paréntesis y +. Ej: +54 11 1234-5678.'
      );
      isValid = false;
    }

    // Dirección: No vacío, 5-255 chars
    if (
      !data.direccion ||
      data.direccion.trim().length < 5 ||
      data.direccion.trim().length > 255
    ) {
      errors.push('La dirección debe tener entre 5 y 255 caracteres.');
      isValid = false;
    }

    // Tipo: Debe ser 'alumno'
    if (data.tipo !== 'alumno') {
      errors.push('El tipo debe ser "alumno" para este registro.');
      isValid = false;
    }

    // CursoId: Si presente, debe ser número válido (validación de existencia en controller)
    if (data.cursoId && (isNaN(data.cursoId) || data.cursoId <= 0)) {
      errors.push('El cursoId debe ser un número positivo válido.');
      isValid = false;
    }

    // Especialidad: Debe ser null para alumnos
    if (data.especialidad && data.especialidad !== null) {
      errors.push('Los alumnos no pueden tener especialidad asignada.');
      isValid = false;
    }

    return { isValid, errors };
  }

  // Validar DNI (para queries y updates)
  static _validateDni(dni) {
    return !isNaN(dni) && dni >= 1000000 && dni <= 99999999;
  }

  // Validar si un curso existe
  static async _validateCursoExists(cursoId) {
    const curso = await Curso.findByPk(cursoId);
    return !!curso;
  }

  // Chequear si una persona tiene dependientes (e.g., evaluaciones para alumnos, dictados para docentes)
  static async _checkDependents(dni) {
    const persona = await Persona.findByPk(dni);
    if (!persona) return false;

    if (persona.tipo === 'alumno') {
      // Chequear evaluaciones
      const evalCount = await Evaluacion.count({ where: { alumnoId: dni } });
      return evalCount > 0;
    } else if (persona.tipo === 'docente') {
      // Chequear dictados
      const dictadoCount = await Dictado.count({ where: { docenteId: dni } });
      return dictadoCount > 0;
    }
    return false;
  }

  // ========================= CREATE =========================
  // Método unificado para crear persona (alumno o docente)
  static async createPersona(personaData) {
    try {
      // Convierte a números
      if (personaData.cursoId)
        personaData.cursoId = Number(personaData.cursoId);
      if (personaData.dni) personaData.dni = Number(personaData.dni);

      // Lógica específica por tipo
      if (personaData.tipo === 'alumno') {
        personaData.especialidad = null;
      } else if (personaData.tipo === 'docente') {
        personaData.cursoId = null;
      }

      // Trim strings para evitar espacios extra
      [
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'especialidad',
      ].forEach((field) => {
        if (personaData[field]) personaData[field] = personaData[field].trim();
      });

      const persona = await Persona.create(personaData);
      return persona;
    } catch (error) {
      // Manejar el error de validación de unicidad
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        if (field === 'dni') {
          throw new Error('El DNI ya se encuentra registrado.');
        }
        // if (field === 'email') {
        //   throw new Error('El email ya se encuentra registrado.');
        // }
      }

      // Manejar otros errores de validación (por ejemplo, formato de email, longitud)
      if (error.name === 'SequelizeValidationError') {
        const validationMessage = error.errors[0].message;
        throw new Error('Error de validación: ' + validationMessage);
      }

      // Manejar cualquier otro tipo de error desconocido
      throw new Error('Error al crear la persona: ' + error.message);
    }
  }

  static async createDocente(docenteData) {
    try {
      // Asegurarse de que sea docente y no tenga curso
      const docente = await Persona.create({
        ...docenteData,
        tipo: 'docente',
        cursoId: null, // Los docentes no tienen curso asignado
      });
      return docente;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una persona con ese DNI o email.');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new Error(
          'Error de validación: ' +
            error.errors.map((e) => e.message).join(', ')
        );
      }
      throw new Error('Error al crear docente: ' + error.message);
    }
  }

  // ========================= READ ===========================

  // Obtener todas las personas
  static async findAllPersonas(options = {}) {
    try {
      const { tipo, includeCurso = false, includeDictados = false } = options;
      const where = {};
      const include = [];

      // Filtrar por tipo si se especifica
      if (tipo) {
        where.tipo = tipo;
      }

      // Incluir curso si se solicita
      if (includeCurso) {
        include.push({
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno'],
        });
      }

      // Incluir dictados si se solicita (solo para docentes)
      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nro_letra', 'turno'],
            },
          ],
        });
      }

      const personas = await Persona.findAll({
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
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
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno'],
        });
      }

      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          attributes: ['id', 'fecha_desde', 'fecha_hasta', 'dias_cursado'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nro_letra', 'turno'],
            },
            {
              model: Materia,
              as: 'materia',
              attributes: ['id', 'nombre', 'descripcion'],
            },
          ],
        });
      }

      const persona = await Persona.findByPk(dni, { include });
      return persona;
    } catch (error) {
      throw new Error('Error al obtener persona por DNI: ' + error.message);
    }
  }

  // Método corregido para obtener alumnos
  static async findAllAlumnos(options = {}) {
    try {
      const { cursoId, includeCurso = true } = options;
      const where = { tipo: 'alumno' };
      const include = [];

      // Filtrar por curso si se especifica
      if (cursoId) {
        where.cursoId = cursoId;
      }

      // Incluir curso si se solicita
      if (includeCurso) {
        include.push({
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno'],
        });
      }

      const alumnos = await Persona.findAll({
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
      });

      return alumnos;
    } catch (error) {
      throw new Error('Error al obtener todos los alumnos: ' + error.message);
    }
  }

  // Método corregido para obtener docentes
  static async findAllDocentes(options = {}) {
    try {
      const {
        especialidad,
        includeDictados = false,
        search,
        page = 1,
        limit = 10,
      } = options;

      const offset = (page - 1) * limit;
      const where = { tipo: 'docente' };
      const include = [];

      if (especialidad) {
        where.especialidad = { [Op.iLike]: `%${especialidad}%` }; // Búsqueda parcial para especialidad
      }
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { especialidad: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (includeDictados) {
        include.push({
          model: Dictado,
          as: 'dictados',
          attributes: ['id', 'anio', 'dias_cursado'],
          include: [
            {
              model: Curso,
              as: 'curso',
              attributes: ['id', 'nro_letra', 'turno'],
            },
            {
              model: Materia,
              as: 'materia',
              attributes: ['id', 'nombre', 'descripcion'],
            },
          ],
        });
      }

      const docentes = await Persona.findAll({
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
        limit,
        offset,
      });

      return docentes;
    } catch (error) {
      throw new Error('Error al obtener todos los docentes: ' + error.message);
    }
  }

  // Obtener alumnos por curso (con paginación opcional)
  static async findAlumnosByCurso(cursoId, options = {}) {
    try {
      const { page = 1, limit = null } = options; // limit null para no paginar por defecto
      const offset = limit ? (page - 1) * limit : 0;
      const where = { tipo: 'alumno', cursoId: parseInt(cursoId) };
      const include = [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nro_letra', 'turno'],
        },
      ];

      const queryOptions = {
        where,
        include,
        order: [
          ['apellido', 'ASC'],
          ['nombre', 'ASC'],
        ],
      };

      if (limit) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      const alumnos = await Persona.findAll(queryOptions);
      return alumnos;
    } catch (error) {
      throw new Error('Error al obtener alumnos por curso: ' + error.message);
    }
  }

  // Método para obtener materias por alumno (mejorado con chequeo de existencia)
  static async getMateriasByAlumnoDni(dni) {
    try {
      if (!this._validateDni(dni)) {
        throw new Error('DNI inválido para consulta de materias.');
      }

      // Busca el alumno por DNI
      const alumno = await Persona.findByPk(parseInt(dni), {
        include: [
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nro_letra', 'turno'],
          },
        ],
        where: { tipo: 'alumno' }, // Asegurar que sea alumno
      });

      if (!alumno || !alumno.cursoId) {
        return []; // No hay curso, no hay materias
      }

      // Busca los dictados del curso del alumno
      const dictados = await Dictado.findAll({
        where: { cursoId: alumno.cursoId },
        include: [
          {
            model: Materia,
            as: 'materia',
            attributes: ['id', 'nombre', 'descripcion'],
          },
        ],
        distinct: true, // Evitar duplicados si hay múltiples dictados por materia
      });

      // Extrae materias únicas
      const materias = dictados.map((d) => d.materia).filter((m) => m); // Filtrar nulls

      return [...new Set(materias.map((m) => m.id))].map((id) =>
        materias.find((m) => m.id === id)
      ); // Unique por ID
    } catch (error) {
      throw new Error(
        'Error al obtener materias por DNI de alumno: ' + error.message
      );
    }
  }

  // ========================= UPDATE =========================

  // Actualizar una persona (integra validación async)
  static async updatePersona(dni, personaData) {
    try {
      const dniNum = parseInt(dni);
      if (!this._validateDni(dniNum)) {
        throw new Error('DNI inválido para actualización.');
      }

      // Validación async (chequea email único, etc.)
      const validation = await this._validateUpdatePersonaData(
        personaData,
        dniNum
      );
      if (!validation.isValid) {
        throw new Error('Validación fallida: ' + validation.errors.join(', '));
      }

      const [updatedRows] = await Persona.update(personaData, {
        where: { dni: dniNum },
      });

      if (updatedRows > 0) {
        // Retornar la persona actualizada con includes básicos si es necesario
        return await this.findPersonaByDni(dniNum, { includeCurso: true });
      }
      return null;
    } catch (error) {
      // No manejar aquí; controller lo hace
      throw error;
    }
  }

  // ========================= DELETE =========================

  // Eliminar una persona (integra chequeo de dependientes)
  static async deletePersona(dni) {
    try {
      const dniNum = parseInt(dni);
      if (!this._validateDni(dniNum)) {
        throw new Error('DNI inválido para eliminación.');
      }

      // Chequear dependientes
      const hasDependents = await this._checkDependents(dniNum);
      if (hasDependents) {
        throw new Error(
          'Persona tiene dependencias activas (notas o dictados). No se puede eliminar.'
        );
      }

      const persona = await Persona.findByPk(dniNum);
      if (!persona) {
        return false;
      }

      // Si es docente, remover relaciones con dictados (set null o destroy si CASCADE)
      if (persona.tipo === 'docente') {
        await Dictado.update(
          { docenteId: null },
          { where: { docenteId: dniNum } }
        );
      }

      const deletedRows = await Persona.destroy({
        where: { dni: dniNum },
      });

      return deletedRows > 0;
    } catch (error) {
      throw error; // Controller maneja
    }
  }

  // ========================= MÉTODOS DE COUNT (para paginación en controller) =========================

  // Contar personas (con filtros, sin includes para eficiencia)
  static async countPersonas(options = {}) {
    try {
      const { tipo, search } = options;
      const where = {};

      if (tipo) {
        where.tipo = tipo;
      }
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      return await Persona.count({ where });
    } catch (error) {
      throw new Error('Error al contar personas: ' + error.message);
    }
  }

  // Contar alumnos (con filtros)
  static async countAlumnos(options = {}) {
    try {
      const { cursoId, search } = options;
      const where = { tipo: 'alumno' };

      if (cursoId) {
        where.cursoId = cursoId;
      }
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      return await Persona.count({ where });
    } catch (error) {
      throw new Error('Error al contar alumnos: ' + error.message);
    }
  }

  // Contar docentes (con filtros)
  static async countDocentes(options = {}) {
    try {
      const { especialidad, search } = options;
      const where = { tipo: 'docente' };

      if (especialidad) {
        where.especialidad = { [Op.iLike]: `%${especialidad}%` };
      }
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { especialidad: { [Op.iLike]: `%${search}%` } },
        ];
      }

      return await Persona.count({ where });
    } catch (error) {
      throw new Error('Error al contar docentes: ' + error.message);
    }
  }

  // Contar alumnos por curso
  static async countAlumnosByCurso(cursoId) {
    try {
      if (!this._validateId(cursoId)) {
        throw new Error('Curso ID inválido para conteo.');
      }
      return await Persona.count({
        where: { tipo: 'alumno', cursoId: parseInt(cursoId) },
      });
    } catch (error) {
      throw new Error('Error al contar alumnos por curso: ' + error.message);
    }
  }
}

module.exports = new PersonaService();
