import { NextFunction, Request, Response } from 'express';
import foroService from './foro.service';

const getUserId = (req: Request) => Number((req as any).user?.userId);

export const getMensajes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mensajes = await foroService.getMensajes(
      getUserId(req),
      Number(req.params.dictadoId),
    );
    if (!mensajes)
      return res
        .status(403)
        .json({ success: false, message: 'No tienes acceso a este foro' });
    return res
      .status(200)
      .json({ success: true, message: 'Mensajes obtenidos', data: mensajes });
  } catch (error) {
    return next(error);
  }
};

export const createMensaje = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mensaje = await foroService.createMensaje(
      getUserId(req),
      Number(req.params.dictadoId),
      req.body.texto,
    );
    if (!mensaje)
      return res
        .status(403)
        .json({ success: false, message: 'No tienes acceso a este foro' });
    return res
      .status(201)
      .json({ success: true, message: 'Mensaje publicado', data: mensaje });
  } catch (error) {
    return next(error);
  }
};
