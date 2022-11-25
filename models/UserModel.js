// import sequelize 
import { Sequelize } from "sequelize";
// import connection 
import db from "../config/Database.js";
 
// init DataTypes
const { DataTypes } = Sequelize;
 
// Define schema
const Users = db.define('tbl_users', {
  // Define attributes
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required: true,
    validate: {
      isUnique: (value, next) => {
        Users.findAll({
          where: { email: value },
          attributes: ['id'],
        })
          .then((user) => {
            if (user.length != 0)
              next(new Error('EMAIL_ALREADY_REGISTERED'));
            next();
          })
          // .catch((onError) => console.log(onError));
          .catch((onError) => console.log('error'));
      },
    },
  },
  password: {
    type: DataTypes.STRING
  },
  token: {
    type: DataTypes.STRING
  },
  role_id: {
    type: DataTypes.DOUBLE
  },
  status: {
    type: DataTypes.INTEGER
  },
  createdAt: {
    field: 'created_at',
    type: Sequelize.DATE,
  },
  updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE,
  },
},{
  // Freeze Table Name
  freezeTableName: true,
});
 
// Export model Product
export default Users;