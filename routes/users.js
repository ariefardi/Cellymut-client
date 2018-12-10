const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller-user')
/* GET users listing. */
router.get('/', Controller.getUsers);
router.get('/:id', Controller.getOneUsers)

router.put('/update/:id', Controller.updateUser)

module.exports = router;
