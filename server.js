const http = require ("http")

function requestController() {
  // Lógica de nuestra función
  console.log("Request recibida")
}

// Configurar nuestro servidor
const server = http.createServer(requestController)

server.listen(4000)