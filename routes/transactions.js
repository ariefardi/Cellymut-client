const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller-transaction')
/* GET home page. */
router.get('/', Controller.getTransactions);
router.get('/:item_id', Controller.getOneTransactions);
router.get('/user/:user_id', Controller.getUserTransactions)

router.post('/buy/item/:item_id', Controller.buyTransaction)

router.delete('/cancel/:trans_id', Controller.cancelTransaction)

module.exports = router;
