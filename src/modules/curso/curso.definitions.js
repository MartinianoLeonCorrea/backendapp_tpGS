const NRO_LETRA = {
  min: 1,
  max: 3,
  required: true,
};

const TURNO = {
  required: true,
  validValues: ['MAÑANA', 'TARDE', 'NOCHE'],
};

module.exports = {
  NRO_LETRA,
  TURNO,
};