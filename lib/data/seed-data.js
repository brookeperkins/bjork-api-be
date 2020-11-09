const Outfit = require('../models/Outfit');
const bjorkData = require('./bjorkData');
const pool = require('../utils/pool');
const fs = require('fs');

pool.query(fs.readFileSync('sql/setup.sql'));
Promise.all(
  bjorkData.map(outfit => {
    return Outfit.insert(outfit);
  })
);
