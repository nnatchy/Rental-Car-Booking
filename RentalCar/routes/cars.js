const express = require('express');
const { getCars,getCar,createCar,updateCar,deleteCar } = require('../controllers/cars');

const router = express.Router();

router.route('/').get(getCars).post(createCar);
router.route('/:id').get(getCar).put(updateCar).delete(deleteCar);

module.exports = router;