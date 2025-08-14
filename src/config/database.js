// Configuración de la conexión a la base de datos con Sequelize

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql', // Especifica que estás usando MySQL
        logging: false, // Desactiva el log de SQL en consola (puedes activarlo para depurar)
        define: {
            timestamps: true, // Agrega createdAt y updatedAt automáticamente
            underscored: true, // Usa snake_case para los nombres de columnas
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Exporta la instancia de Sequelize para usarla en otros archivos

module.exports = {
    sequelize
};
