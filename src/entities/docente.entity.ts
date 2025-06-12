export class Docente {
  constructor(
    public dni: string,
    public nombre: string,
    public apellido: string,
    public direccion: string,
    public telefono: number,
    public especialidad: string,
    public mail: string,
    public legajo: string //ver si es opcional
  ) {}
}
