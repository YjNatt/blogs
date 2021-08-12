const helper = require('./test_helper');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);

beforeEach(async() => {
  await User.deleteMany({});
});

describe('adding new user', () => {
  test('adding valid user', async() => {
    const user = {
      username: 'testUsername',
      password: 'testPassword',
      name: 'testName'
    }

    const result = await api.post('/api/users')
                            .send(user)
                            .expect(200)
                            .expect('Content-Type', /application\/json/);

    const users = await helper.usersInDb();
    expect(users[0].username).toBe(user.username);
  });

  test('adding invalid username', async() => {
    const user = {
      username: 'a',
      password: 'testPassword',
      name: 'testName'
    }

    const result = await api.post('/api/users')
                            .send(user)
                            .expect(400)
                            .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` (`a`) is shorter than the minimum');
  });

  test('adding invalid password', async() => {
    const user = {
      username: 'testUsername',
      password: 'a',
      name: 'testName'
    }

    result = await api.post('/api/users')
                      .send(user)
                      .expect(400)
  })
})