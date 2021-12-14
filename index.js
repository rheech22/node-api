const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');

const user = require('./api/user');

// 테스트 환경이 아닐 때만 로그가 출력되도록 수정
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use('/users', user);

// 테스트 환경에서 출력되지 않도록 분리
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });

module.exports = app;
