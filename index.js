require('dotenv').config();
//librería para manejar archivos estáticos más facilmente
const express = require('express');
const app = express();
const port = process.env.PORT; //4000

//Servir archivos estáticos
app.use(express.static('../frontendapp_tpGS'));

// Configurar las rutas
app.get('/', function (req, res) {
  res.send('Hola mundo');
});
app.get('/users', function (req, res) {
  res.send([{ name: 'Lara' }, { name: 'Jonatan' }, { name: 'Martiniano' }]);
});

//Poner a escruchar la App en un puerto
app.listen(port, function () {
  console.log('Aplicación corriendo en el puerto: ' + port);
});
