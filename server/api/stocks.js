const router = require('express').Router();
const {
  models: { Stock }
} = require ('../db')

//GET request /api/stocks
router.get('/', async (req, res, next) => {
  try {
    const stocks = await Stock.findAll()
    res.status(200).json(stocks)
  } catch (error) {
    next(error)
  }
})

module.exports = router
