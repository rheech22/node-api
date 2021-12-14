const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite', // db는 파일형태로 되어있으므로 경로를 적어준다
  logging: false, // 불필요한 로그를 보지 않으려면 적용
});

const User = sequelize.define('User', {
  // id는 자동 생성
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = {
  Sequelize,
  sequelize,
  User,
};
