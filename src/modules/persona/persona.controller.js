const personaService = require('./persona.service');

const createPersona = async (req, res, next) => {
  try {
    const personaData = req.body; 
    const newPersona = await personaService.createPersona(personaData);
    res.status(201).json(newPersona);
  } catch (error) {
    next(error);
  }
};

const getAllPersonas = async (req, res, next) => {
  try {
    const personas = await personaService.findAllPersonas();
    res.status(200).json(personas);
  } catch (error) {
    next(error);
  }
};

const getPersonaByDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const persona = await personaService.findPersonaByDni(dni);
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    } 
    res.status(200).json(persona);
  } catch (error) {
    next(error);
  }
};

const updatePersona = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const personaData = req.body;
    const updatedPersona = await personaService.updatePersona(dni, personaData);
    if (!updatedPersona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    } 
    res.status(200).json(updatedPersona);
  } catch (error) {
    next(error);
  }
};

const deletePersona = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const deletedPersona = await personaService.deletePersona(dni);
    if (!deletedPersona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPersona,
  getAllPersonas,
  getPersonaByDni,
  updatePersona,
  deletePersona
};

//listo
