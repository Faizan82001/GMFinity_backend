// playlistRoutes.js
const express = require("express");
const requireAuth = require("../Middlewares/authMiddleware");
const router = express.Router();
const { addToPlaylist, removeFromPlaylist, getUserPlaylists, createOrUpdatePlaylist, getPublicPlaylists, getPlaylistItemsByName } = require("../Controllers/playlistContoller");

// Route to create a new playlist for a user
router.post("/playlist",requireAuth, createOrUpdatePlaylist);
router.post("/add-to-playlist", requireAuth, addToPlaylist);
router.post("/remove-from-playlist", requireAuth, removeFromPlaylist);
router.get("/public-playlists", requireAuth, getPublicPlaylists);
router.get("/", requireAuth, getUserPlaylists);
router.get("/playlist/:name", getPlaylistItemsByName);

module.exports = router;
