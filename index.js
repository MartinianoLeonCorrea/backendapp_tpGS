const http = require ("http")

function requestController() {
  console.log("Request recibida")
}

// Configuración del servidor
const server = http.createServer(requestController)

server.listen(4000)