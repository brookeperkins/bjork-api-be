const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const fs = require('fs');

describe('bjork-api-be routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a new bjork outfit entry', () => {
    return request(app)
      .post('/api/outfits')
      .send({
        img: 'bjork.jpg',
        year: 1995,
        quote: 'some delightfully weird bjork quote'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          img: 'bjork.jpg',
          year: 1995,
          quote: 'some delightfully weird bjork quote'
        });
      });
  });
});
