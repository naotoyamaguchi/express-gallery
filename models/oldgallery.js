module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    author: DataTypes.STRING,
    link: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      // associate: function(models) {
      //   Post.hasMany(models.Task)
      // }
    }
  });

  return Post;
};