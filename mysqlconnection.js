// Importo dependencia de mysql
let mysql = require ("mysql2");

// Conecto al proyecto con una base de datos mysql de nombre "secundaria"
let connection = mysql.createConnection({
    host: "localhost",
    database: "secundaria",
    user: "root",
    password: ""
});

// Compruebo su funciona la conexión
connection.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("Conexión con base de datos exitosa!!")
    }
});

connection.end();