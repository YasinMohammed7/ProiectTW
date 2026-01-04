const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const directionsController = require('../controllers/directionsController');

router.use(verifyJWT);

router.route('/').post(directionsController.createDirection);
router.route('/').get(directionsController.getUserDirections);
router.route('/:id').delete(directionsController.deleteUserDirection);
router.route('/:id').put(directionsController.updateUserDirection);

module.exports = router;