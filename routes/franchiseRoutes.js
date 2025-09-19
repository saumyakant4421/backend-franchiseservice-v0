// routes/franchiseRoutes.js
const express = require('express');
const { searchFranchisesHandler, getFranchiseDetailsHandler, fetchMoviesByFranchiseHandler } = require('../controllers/franchiseController');

const router = express.Router();

router.get('/search', searchFranchisesHandler);
router.get('/movies/:collectionId', fetchMoviesByFranchiseHandler);
router.get('/:collectionId', getFranchiseDetailsHandler);

module.exports = router;