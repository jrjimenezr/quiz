//Definición del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
    {
      pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "La <strong>pregunta</strong> no puede estar vacía"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "La <strong>respuesta</strong> no puede estar vacía"}}
      }
    });
}
