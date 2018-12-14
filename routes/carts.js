const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller-cart')
/* GET home page. */
router.get('/get/all', Controller.getCarts)
router.get('/', Controller.getCartsByUserId);
router.get('/:cart_id', Controller.getOneCart)


router.post('/add/:item_id', Controller.addCart)

router.put('/add-quantity/:cart_id', Controller.addQuantity)

router.delete('/delete/:cart_id', Controller.deleteCart)

module.exports = router;
