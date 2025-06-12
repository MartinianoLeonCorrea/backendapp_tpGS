export class Alumno {
  constructor(
    public dni: string,
    public nombre: string,
    public apellido: string,
    public direccion: string,
    public telefono: number,
    public mail: string,
    public legajo: string //ver si es opcional
  ) {}
}
