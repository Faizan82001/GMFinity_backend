const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: mongoose.Schema.Types.Mixed }],
    isPublic: { type: Boolean, default: true },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
