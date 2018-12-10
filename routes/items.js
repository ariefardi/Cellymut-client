var express = require('express');
var router = express.Router();
const Controller = require('../controller/controller-item')
const Middleware = require('../middleware/middleware-item')
/* GET users listing. */
router.get('/', Controller.getItems);
router.get('/:id', Controller.getOneItem)

router.post('/add', Middleware.checkToken, Controller.addItem)

module.exports = router;
