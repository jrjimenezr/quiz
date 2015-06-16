//Definición del modelo de Comment con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Comment',
    {
      texto: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "El <strong>comentario</strong> no puede estar vacía"}}
      }
    });
}
