const models = require('../models');

module.exports = () => {
  const options = {
    force: process.env.NODE_ENV === 'test' ? true : false,
  };
  return models.sequelize.sync(options);
  // force: true => 기존에 db가 있더라도 다 날려버리고 새로 생성한다는 의미
  // sync 함수는 프라미스 객체를 리턴함
};
