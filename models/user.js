module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    user: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "must not be empty..."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "must not be empty..."
        }
      }
    }
  }, {
    classMethods: {

    }
  });
  return User;
};