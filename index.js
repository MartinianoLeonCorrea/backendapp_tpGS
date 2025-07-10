const http = require ("http")

function requestController() {
  console.log("Request recibida")
}

// Configurar nuestro servidor
const server = http.createServer(requestController)

server.listen(4000)