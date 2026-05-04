import { orm } from '../../config/mikro-orm';
import { Material } from './material.entity';
import { Dictado } from '../dictado/dictado.entity';

class MaterialService {
  private get em() {
    return orm.em.fork();
  }

  // ========================= CREATE =========================
  async createMaterial(data: any) {
    const em = this.em;
    const { dictadoId, ...materialData } = data;

    const dictado = await em.findOne(Dictado, { id: dictadoId });
    if (!dictado) throw new Error('El dictado no existe');

    const material = em.create(Material, {
      ...materialData,
      dictado,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush(material);
    return material;
  }

  // ========================= READ ===========================
  async getAllMateriales() {
    return await this.em.find(Material, {}, {
      populate: ['dictado', 'dictado.materia', 'dictado.docente'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  async getMaterialById(id: number) {
    return await this.em.findOne(Material, { id }, {
      populate: ['dictado', 'dictado.materia', 'dictado.docente'],
    });
  }

  async getMaterialesByDictado(dictadoId: number) {
    return await this.em.find(Material, { dictado: dictadoId }, {
      populate: ['dictado', 'dictado.materia', 'dictado.docente'],
      orderBy: { createdAt: 'DESC' },
    });
  }

  // ========================= UPDATE =========================
  async updateMaterial(id: number, data: any) {
    const em = this.em;
    const material = await em.findOne(Material, { id });
    if (!material) return null;

    Object.assign(material, data);
    await em.flush();
    return material;
  }

  // ========================= DELETE =========================
  async deleteMaterial(id: number) {
    const em = this.em;
    const material = await em.findOne(Material, { id });
    if (!material) return false;

    await em.removeAndFlush(material);
    return true;
  }

  // ========================= RESPONSES =========================
  successResponse(message: string, data: any) {
    return { success: true, message, data };
  }

  errorResponse(message: string, errors: string[] = []) {
    return { success: false, message, errors };
  }
}

export default new MaterialService();