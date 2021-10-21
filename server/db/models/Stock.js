const Sequelize = require('sequelize');
const db = require('../db');

const Stock = db.define('stock', {
  ticker: {
    type: Sequelize.STRING,
  },
  companyName: {
    type: Sequelize.STRING
  },
  references: {
    type: Sequelize.INTEGER,
  },
  sentiment: {
    type: Sequelize.FLOAT
  },
  avgSentiment: {
    type: Sequelize.FLOAT
  }

})

module.exports = Stock
