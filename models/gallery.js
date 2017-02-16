module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      // associate: function(models) {
      //   Post.hasMany(models.Task)
      // }
    }
  });

  return Post;
};