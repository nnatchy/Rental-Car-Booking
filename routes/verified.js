const express = require('express');

const { createVerification, getVerification, updateVerification } = require('../controllers/verified')

const router = express.Router();

router.route('/').post(createVerification)
router.route('/:userId').get(getVerification).put(updateVerification)

module.exports = router;