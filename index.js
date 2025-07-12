// Librerías
require('dotenv').config()
const http = require ("http")
const fs = require('fs')

// Configuración del controlador de peticiones
function requestController(req, res) {
  const URL = req.url
  const METHOD = req.method
  console.log({ URL, METHOD })
  if ( METHOD === 'GET' && URL === '/' ){
    res.setHeader("Content-type", "text/html; charset=utf-8")
    fs.readFile('../frontendapp_TPGS/index.html', function(err, file){
      if(err) {
        console.log("Hubo un error")
      }
      res.write(file)
      res.end()
    })
    return
  }
  if ( METHOD === 'GET' && URL === '/about' ){
    res.setHeader("Content-type", "text/html; charset=utf-8")
    res.write("<h1>Bienvenido a la sección about de la aplicación</h1>")
    res.end()
    return
  }
  res.setHeader("Content-type", "text/html; charset=utf-8")
  res.write("<h1>Página no encontrada...</h1>")
  res.end()
}

// Configuración del servidor
const server = http.createServer(requestController)
const PORT = process.env.PORT
server.listen(PORT, function () {
  console.log("Apliación corriendo en puerto: " + PORT)
})