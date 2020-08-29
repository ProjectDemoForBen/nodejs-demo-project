const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.use(isAuth);
router.get('/:userId/status', userController.getStatus);
router.patch('/:userId/status', userController.updateStatus)

module.exports = router;