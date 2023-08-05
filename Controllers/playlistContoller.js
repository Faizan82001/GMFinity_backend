const Playlist = require("../Models/playlistModel");
const User = require("../Models/user");

const createOrUpdatePlaylist = async (req, res) => {
    try {
        const { name, isPublic } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const existingPlaylist = await Playlist.findOne({ name, user: userId });
        if (existingPlaylist) {
            existingPlaylist.isPublic =
                isPublic === undefined ? true : isPublic;
            const updatedPlaylist = await existingPlaylist.save();
            res.status(200).json({playlist: updatedPlaylist, message: "Playlist updated Successfully!"});
        } else {
            const newPlaylist = new Playlist({
                name,
                user: userId,
                isPublic: isPublic === undefined ? true : isPublic,
            });

            const playlist = await newPlaylist.save();

            user.playlists.push(playlist.id);
            await user.save();
            res.status(201).json({ playlist, message: "Playlist created Successfully!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error creating or updating playlist" });
    }
};

const addToPlaylist = async (req, res) => {
    try {
        const { playlistId, movieData } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found." });
        }
        if (playlist.user.toString() !== userId.toString()) {
            return res.status(403).json({
                error: "You do not have permission to modify this playlist.",
            });
        }

        const existingMovie = playlist.items.find(
            (item) => item.imdbID === movieData.imdbID
        );

        if (existingMovie) {
            return res.status(409).json({
                error: "Already in playlist",
            });
        }

        playlist.items.push(movieData);
        await playlist.save();
        res.status(200).json({playlist, message: "Movie Successfully Added!"});
    } catch (error) {
        res.status(500).json({ error: "Error adding movie to playlist" });
    }
};

const removeFromPlaylist = async (req, res) => {
    try {
        const { playlistId, movieId } = req.body;
        const userId = req.user._id;
        if (!userId) {
            return res.status(404).json({ error: "User not found." });
        }
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found." });
        }

        if (playlist.user.toString() !== userId.toString()) {
            return res.status(403).json({
                error: "You do not have permission to modify this playlist.",
            });
        }

        playlist.items = playlist.items.filter(
            (item) => item.imdbID !== movieId
        );

        await playlist.save();
        res.status(200).json({playlist, message: "Removed From Playlist!"});
    } catch (error) {
        res.status(500).json({ error: "Error removing movie from playlist" });
    }
};

const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user._id;
        const userPlaylists = await Playlist.find({ user: userId });
        res.status(200).json(userPlaylists);
    } catch (error) {
        res.status(500).json({ error: "Error fetching playlists" });
    }
};

const getPublicPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ isPublic: true }).populate(
            "user",
            "username email"
        );
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: "Error fetching playlists" });
    }
};

const getPlaylistItemsByName = async (req, res) => {
    try {
        const playlistName = req.params.name;

        const playlist = await Playlist.findOne({ name: playlistName });

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found." });
        }
        const userId = req.user._id;

        if (!playlist.isPublic && playlist.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Access denied." });
        }
        const playlistItems = playlist.items;
        res.status(200).json(playlistItems);
    } catch (error) {
        res.status(500).json({ error: "Error fetching playlist items." });
    }
};

module.exports = {
    createOrUpdatePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    getUserPlaylists,
    getPublicPlaylists,
    getPlaylistItemsByName,
};
