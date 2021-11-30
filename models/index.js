const dbConfig = require("../config/db.config.js");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0, //false

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.class = require("./class.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.user_class = require("./user_class.model.js")(sequelize, Sequelize);
db.teacherWaiting = require("./teacherWaiting.model.js")(sequelize, Sequelize);
db.assignment = require("./assignment.model.js")(sequelize, Sequelize);

db.class.belongsTo(db.user, { foreignKey: "ownerId" });
db.user.hasMany(db.class, { foreignKey: "ownerId", as: "owner" });

db.teacherWaiting.belongsTo(db.class, { foreignKey: "classId" });
db.class.hasMany(db.teacherWaiting, {
  foreignKey: "classId",
  as: "waitingTeachers",
});

db.assignment.belongsTo(db.class, { foreignKey: "classId" });
db.assignment.belongsTo(db.user, {foreignKey: "creatorId"});
db.class.hasMany(db.assignment, {
  foreignKey: "classId",
  as: "assignments",
});
db.user.hasMany(db.assignment, {foreignKey: "creatorId", as: "creator"});


db.class.belongsToMany(db.user, {
  through: db.user_class,
  as: "users",
});
db.user.belongsToMany(db.class, {
  through: db.user_class,
  as: "classes",
});

db.user.hasMany(db.user_class);
db.user_class.belongsTo(db.user);
db.class.hasMany(db.user_class);
db.user_class.belongsTo(db.class);

module.exports = db;
