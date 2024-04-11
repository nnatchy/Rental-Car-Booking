const express = require('express')

const { register, login, getMe, logout, verifyUser, forgotPassword, resetPassword } = require('../controllers/auth')
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - tel
 *         - password
 *       properties:
 *         id: 
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the user
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           description: User email
 *         tel:
 *           type: string
 *           description: Telephone number
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         id: 609bda561452242d88d36e37
 *         name: User1
 *         email: user1.gmail.com
 *         tel: 0123456789
 *         password: 12345678
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
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
* /auth/me:
*   get:
*     summary: Get the user information
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The user information
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: Create a new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       401:
*         description: Invalid request parameters
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   description: Invalid credentials
*                   example: "false"
*/

/**
* @swagger
* /auth/login:
*   post:
*     summary: Log in a user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*                 description: User email
*               password:
*                 type: string
*                 format: password
*                 description: User password
*     responses:
*       200:
*         description: Login user successfully 
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Invalid request parameters
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   example: "false"
*                 message:
*                   type: string
*                   description: Invalid credentials
*                   example: "Invalid credentials"
*       401:
*         description: Invalid request parameters
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: string
*                   example: "false"
*                 message:
*                   type: string
*                   description: Invalid credentials
*                   example: "Invalid credentials"
*/

/**
* @swagger
* /auth/logout:
*   get:
*     summary: Logout the user
*     tags: [Users]
*     responses:
*       200:
*         description: User logged out successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 msg:
*                   type: string
*                   example: "Logout successful"
*                 data:
*                   type: object
*                   description: Additional data (if any)
*                   example: {}
*/


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout)
router.put('/verified/:id', verifyUser)
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:id/:token', resetPassword);

module.exports = router;