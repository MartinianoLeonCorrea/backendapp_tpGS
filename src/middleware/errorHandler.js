const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return res.status(400).json({
      success: false,
      message: `El ${field} ya existe.`,
      errors: [err.errors[0].message],
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación de Sequelize',
      errors: err.errors.map((e) => e.message),
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || 'Error desconocido',
    errors: [],
  });
};

module.exports = errorHandler;
