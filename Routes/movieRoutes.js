// playlistRoutes.js
const express = require("express");
const router = express.Router();
const {
    searchMovie
} = require("../Controllers/movieContoller");

router.get("/", searchMovie);

module.exports = router;
