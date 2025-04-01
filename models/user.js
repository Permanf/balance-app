module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
};