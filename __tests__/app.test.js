const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Outfit = require('../lib/models/Outfit');
const fs = require('fs');

describe('bjork-api-be routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a new bjork outfit entry', () => {
    return request(app)
      .post('/outfits')
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

  it ('gets all the bjork outfit entries', async() => {
    const outfits = await Promise.all([{
      img: 'bjork.jpg',
      year: 2000,
      quote: 'something something something -bjork'
    },
    {
      img: 'bjork1.jpg',
      year: 1994,
      quote: 'here is another quote by me, bjork!'
    },
    {
      img: 'swandress.jpg',
      year: 2012,
      quote: 'something in icelandic, perhaps?'
    }].map(outfit => Outfit.insert(outfit)));

    return request(app)
      .get('/outfits')
      .then(res => {
        outfits.forEach(outfit => {
          expect(res.body).toContainEqual(outfit);
        });
      });
  });

  it('gets an outfit by id', async() => {
    const outfit = await Outfit.insert({
      img: 'BjorkPic.jpg',
      year: 2018,
      quote: 'This is a quote.'
    });

    return request(app)
      .get(`/outfits/${outfit.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          img: 'BjorkPic.jpg',
          year: 2018,
          quote: 'This is a quote.'
        });
      });
  });

  it('updates an outfit by id', async() => {
    const outfit = await Outfit.insert({
      img: 'BjorkDress.jpg',
      year: 2014,
      quote: 'This is another quote.'
    });

    return request(app)
      .put(`/outfits/${outfit.id}`)
      .send({
        img: 'ADifferentDress.jpg',
        year: 2011,
        quote: 'This is a new quote.'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          img: 'ADifferentDress.jpg',
          year: 2011,
          quote: 'This is a new quote.'
        });
      });
  });

  it('deletes an outfit by id', async() => {
    const outfit = await Outfit.insert({
      img: 'BjorkPic.jpg',
      year: 2014,
      quote: 'This is a quote.'
    });

    return request(app)
      .delete(`/outfits/${outfit.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          img: 'BjorkPic.jpg',
          year: 2014,
          quote: 'This is a quote.'
        });
      }); 
  });
});
