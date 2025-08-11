const { Persona } = require('../models/persona.model');
const { Op } = require('sequelize');

class PersonaService {
  async getAll() {
    return await Persona.findAll();
  }

  async getById(id) {
    return await Persona.findByPk(id);
  }

  async create(data) {
    return await Persona.create(data);
  }

  async update(id, data) {
    const persona = await Persona.findByPk(id);
    if (!persona) return null;
    await persona.update(data);
    return persona;
  }

  async delete(id) {
    const persona = await Persona.findByPk(id);
    if (!persona) return null;
    await persona.destroy();
    return persona;
  }

  async searchByName(name) {
    return await Persona.findAll({
      where: {
        nombre: {
          [Op.like]: `%${name}%`
        }
      }
    });
  }
}

module.exports = new PersonaService();