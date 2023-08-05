// playlistRoutes.js
const express = require("express");
const router = express.Router();
const { addToPlaylist, removeFromPlaylist, getUserPlaylists, createOrUpdatePlaylist, getPublicPlaylists, getPlaylistItemsByName } = require("../Controllers/playlistContoller");

// Route to create a new playlist for a user
router.post("/playlist", createOrUpdatePlaylist);
router.post("/add-to-playlist", addToPlaylist);
router.post("/remove-from-playlist", removeFromPlaylist);
router.get("/public-playlists", getPublicPlaylists);
router.get("/", getUserPlaylists);
router.get("/playlist/:name", getPlaylistItemsByName);

module.exports = router;
