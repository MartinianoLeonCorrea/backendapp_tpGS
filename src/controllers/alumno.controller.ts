import { Alumno } from './../entities/alumno.entity.ts';

async function findOne() {}
/*
async function findAll(req: Request, res: Response){
    res.json({ data: await repository.findAll()})
}
*/
/*public async findAll(): Promise<Alumno[] | undefined> {
        const [alumno] = await pool.query('SELECT * FROM alumno')
        return alumno as Alumno[]
}
*/

async function create(req, res) {
  const { dni, nombre, apellido, direccion, telefono, email, legajo } =
    req.body;
  try {
    res.json({
      dni,
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      legajo,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function update() {}
/*
async function delete() {

}
*/
