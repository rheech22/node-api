// 테스트 코드
const app = require('../../'); // This means '../../index.js'
const request = require('supertest');
const should = require('should');
const models = require('../../models');

describe('GET /users', () => {
  // 테스트를 위한 샘플 데이터
  const users = [{ name: 'zed' }, { name: 'elice' }, { name: 'lee' }];
  // db sync는 비동기로 실행되므로 done을 사용해도 되지만
  // 모카에서는 아래처럼 비동기 함수를 리턴하면 자동으로 비동기 처리 해줌
  before(() => models.sequelize.sync({ force: true }));
  // bukCreate는 여러 데이터를 생성할 수 있는 메서드
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('유저 객체를 담은 배열로 응답한다', (done) => {
      request(app)
        .get('/users')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
    it('최대 limit 만큼 응답한다', (done) => {
      request(app)
        .get('/users?limit=2')
        .end((err, res) => {
          res.body.should.have.lengthOf(2);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다', (done) => {
      request(app).get('/users?limit=two').expect(400).end(done);
    });
  });
});

describe('GET /users/:id', () => {
  const users = [{ name: 'zed' }, { name: 'elice' }, { name: 'lee' }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('id가 1인 유저 객체를 반환한다', (done) => {
      request(app)
        .get('/users/1')
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('id가 숫자가 아닐 경우 400으로 응답한다', (done) => {
      request(app).get('/users/one').expect(400).end(done);
    });
    it('id로 유저를 찾을 수 없는 경우 404로 응답한다', (done) => {
      request(app).get('/users/999').expect(404).end(done);
    });
  });
});

describe('DELETE /users/:id', () => {
  const users = [{ name: 'zed' }, { name: 'elice' }, { name: 'lee' }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('204를 응답한다.', (done) => {
      request(app).delete('/users/1').expect(204).end(done);
    });
  });
  describe('실패시', () => {
    it('id가 숫자가 아닐 경우 400으로 응답한다', (done) => {
      request(app).delete('/users/one').expect(400).end(done);
    });
  });
});

describe('POST /users', () => {
  const users = [{ name: 'zed' }, { name: 'elice' }, { name: 'lee' }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    let body,
      name = 'daniel';
    before((done) => {
      request(app)
        .post('/users')
        .send({ name })
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });
    it('생성된 유저 객체를 반환한다', () => {
      body.should.have.property('id');
    });
    it('입력한 name을 반환한다', () => {
      body.should.have.property('name', name);
    });
  });
  describe('실패시', () => {
    it('name 파라미터 누락시 400을 반환한다', (done) => {
      request(app).post('/users').send({}).expect(400).end(done);
    });
    it('name이 중복일 경우 409를 반환한다.', (done) => {
      request(app)
        .post('/users')
        .send({ name: 'daniel' })
        .expect(409)
        .end(done);
    });
  });
});

describe('PUT /users/:id', () => {
  const users = [{ name: 'zed' }, { name: 'elice' }, { name: 'lee' }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.User.bulkCreate(users));

  describe('성공시', () => {
    it('name이 변경된 유저 객체를 반환한다', (done) => {
      const name = 'Tom';

      request(app)
        .put('/users/3')
        .send({ name })
        .end((err, res) => {
          res.body.should.have.property('name', name);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('정수가 아닌 id일 경우 400으로 응답한다', (done) => {
      request(app)
        .put('/users/three')
        .send({ name: 'test' })
        .expect(400)
        .end(done);
    });
    it('name이 없을 경우 400으로 응답한다', (done) => {
      request(app).put('/users/3').send({}).expect(400).end(done);
    });
    it('유저가 없을 경우 404로 응답한다', (done) => {
      request(app)
        .put('/users/999')
        .send({ name: 'test' })
        .expect(404)
        .end(done);
    });
    it('이름이 중복일 경우 409로 응답한다', (done) => {
      request(app).put('/users/3').send({ name: 'zed' }).expect(409).end(done);
    });
  });
});
