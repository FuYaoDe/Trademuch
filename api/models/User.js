module.exports = {
  attributes: {
    uuid: {
      type: Sequelize.UUID
    },
    avatar: {
      type: Sequelize.TEXT,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fullName: {
      type: Sequelize.STRING,
      field: 'full_name'

    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name'
    },

    email: {
      type: Sequelize.STRING,
      unique: true
    },
    telephone: {
      type: Sequelize.STRING
    },

    age: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    gender:{
      type: Sequelize.ENUM('none', 'male', 'female'),
      defaultValue: 'none'
    },
    isFirstLogin:{
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      field: 'is_first_login'
    },
    isAgreePolicies:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: 'is_read_policy',
    },
    agreePolicyTime: {
      type: Sequelize.DATE,
      field: 'agree_policy_time',
    },

    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at'
    }

  },
  associations: function() {
    User.hasMany(Post, {foreignKey: 'user_id'});
    User.hasMany(TradeRecord, {foreignKey: 'user_id'});
    User.hasMany(Passport, {foreignKey: 'user_id'});
    User.belongsToMany(Place, {foreignKey: 'user_id', through: UserPlace});
    User.belongsToMany(Post, {foreignKey: 'user_id', through: UserFavorite});
    User.belongsToMany(Room, {foreignKey: 'user_id', through: RoomUser});
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {},
    tableName: 'user'
  }
};
