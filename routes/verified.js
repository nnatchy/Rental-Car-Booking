const express = require('express');

const { createVerification, getVerification } = require('../controllers/verified')

const router = express.Router();

router.route('/').post(createVerification)
router.route('/:id').get(getVerification)

module.exports = router;