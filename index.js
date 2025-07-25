require('dotenv').config();
//Librería para manejar archivos estáticos más facilmente
const express = require('express');
const app = express();
const port = process.env.PORT; //4000

//Middleware para servir archivos estáticos
app.use(express.static('../frontendapp_tpGS'));

// Middleware para parsear el body de las request
// Lo declaramos arriba de todo globalmente para que se aplique a todas las rutas
app.use(express.json());

//A) Pasamos una función anónima
app.use((req, res, next) => {
  console.log('No especificamos como debe ser el inicio de la ruta');
  console.log('Middleware 1');
  next();
});

//B) Pasamos una función RETORNADA por OTRA FUNCIÓN/MÉTODO
const logger = {
  logThis: (whatToLog) => {
    return (req, res, next) => {
      console.log('Middleware 2: ', whatToLog);
      next();
    };
  },
};
app.use('/martin', logger.logThis('Logueame estooo'));

// Middleware para parsear BODY de la REQUEST
app.post('/api/tasks', function (req, res) {
  const body = req.body;
  console.log({ body });
  res.status(201).json({ ok: true, message: 'Tarea creda con éxito' });
});

// Configurar las rutas
app.get('/', function (req, res) {
  res.send('Hola mundo');
});
app.get('/users', function (req, res) {
  res.send([{ name: 'Lara' }, { name: 'Jonatan' }, { name: 'Martiniano' }]);
});

// Poner a escruchar la app en un puerto
app.listen(port, function () {
  console.log('Aplicación corriendo en el puerto: ' + port);
});
