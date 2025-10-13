const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      console.log('Errores de validación recibidos:', formattedErrors);

      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: formattedErrors,
      });
    }

    next();
  };
};

module.exports = { validateRequest };
