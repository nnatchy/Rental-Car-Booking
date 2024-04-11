const express = require('express');

const { createVerification, updateVerification } = require('../controllers/verified')

const router = express.Router();

router.route('/').post(createVerification)
router.route('/:userId').put(updateVerification)

module.exports = router;