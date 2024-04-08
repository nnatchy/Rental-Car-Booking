const express = require('express');
const {getBookings,getBooking,addBooking,updateBooking,deleteBooking} = require('../controllers/bookings');

const router = express.Router({mergeParams: true});

const {protect} = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - apptDate
 *         - user
 *         - car
 *       properties:
 *         id: 
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the booking.
 *         apptDate:
 *           type: string
 *           format: date-time
 *           description: The date and time the booking is made for, in ISO 8601 format.
 *         user:
 *           type: string
 *           description: The user's ID who is making the booking.
 *         car:
 *           type: string
 *           description: Car id for booking
 *       example:
 *         id: "6613c0f540350dcef6af9a98"
 *         apptDate: "2022-01-15T17:00:00.000Z"
 *         user: "660d787f927ced27dca2236f"
 *         car: "660d7d82f79a361be5915e50"
 */


/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: The bookings managing API
*/

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Returns the list of all the bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Retrieves bookings. Admin users can view all bookings or filter by car ID, while general users can only see their own bookings.
 *     parameters:
 *       - in: query
 *         name: carId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional car ID to filter bookings (admin only).
 *     responses:
 *       200:
 *         description: A list of bookings based on the user's role.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Unauthorized access attempt to another user's booking.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User cannot view another user booking"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot find Booking"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Returns booking from id
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: 
 *      Booking information from booking_id
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         description: The booking id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of bookings based on the user's role.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       404:
 *         description: No booking with the id of request parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No booking with the id of 6613c0f540350dcef6af9a98"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot find Booking"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: The booking was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error for attempting to book a car on the same date or missing necessary data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot book the same car with the same date."
 *       401:
 *         description: User has exceeded the maximum number of bookings allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This user ID has already made 3 bookings."
 *       402:
 *         description: Attempt to create a booking with an invalid appointment date.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Appointment date cannot be today or in the past."
 *       404:
 *         description: Specified car ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No car with the provided ID found."
 *       500:
 *         description: Server error when attempting to process the booking.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot create booking due to a server error."
 */


router.route('/').get(protect,getBookings).post(protect,addBooking);
router.route('/:id').get(protect,getBooking).put(protect,updateBooking).delete(protect,deleteBooking);

module.exports = router;