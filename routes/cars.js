const express = require('express');
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/cars');


/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - district
 *         - province
 *         - tel
 *         - region
 *       properties:
 *         id: 
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the hospital
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           description: Hospital name (Name can not be more than 50 characters)
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: Province
 *         tel:
 *           type: string
 *           description: Telephone number must be either 9 or 10 digits long
 *         region:
 *           type: string
 *           description: Region
 *       example:
 *         id: 609bda561452242d88d36e37
 *         name: Happy Hospital
 *         address: 121 ถ.สุขุมวิท
 *         district: บางนา
 *         province: กรุงเทพมหานคร
 *         postalcode: 10110
 *         tel: 02-2187000
 *         region: กรุงเทพมหานคร (Bangkok)
 */

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: The cars managing API
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Returns the list of all the cars
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: The list of the cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       400:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "false"
 */

/**
* @swagger
* /cars/{id}:
*   get:
*     summary: Get the car by id
*     tags: [Cars]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The car id
*         schema:
*           type: string
*     responses:
*       200:
*         description: Car details retrieved successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Car'
*       400:
*         description: Car not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   example: "false"
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:   
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*
* /cars:
*   post:
*     summary: Create a new car
*     tags: [Cars]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Car'
*     responses:
*       201:
*         description: The car was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Car'
*       400:
*         description: Cannot create car
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   example: "false"
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:   
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*
* /cars/{id}:
*   put:
*     summary: Update the car by id
*     tags: [Cars]
*     security:
*       - bearerAuth: [] 
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The car id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Car'
*     responses:
*       200:
*         description: The car was successfully update
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Car'
*       400:
*         description: Cannot update car
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   example: "false"
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:   
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*
* /cars/{id}:
*   delete:
*     summary: Remove the car by id
*     tags: [Cars]
*     security:
*       - bearerAuth: []  
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The car id
*     responses:
*       200:
*         description: The car was deleted
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: object
*                   description: Invalid credentials
*                   example: {}
*       400:
*         description: Cannot delete car
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   example: "false"
*/



const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(getCars).post(protect,authorize("admin"), createCar);
router.route('/:id').get(getCar).put(protect,authorize("admin"), updateCar).delete(protect,authorize("admin"), deleteCar);

module.exports = router;