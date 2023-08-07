const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./Database/db");
const userRoutes = require("./Routes/userRoutes");
const playlistRoutes = require("./Routes/playlistRoutes");
const movieRoutes = require("./Routes/movieRoutes");
const requireAuth = require("./Middlewares/authMiddleware");
const cors = require('cors')
require("dotenv").config();

const app = express();
app.use(cors())
app.use(bodyParser.json());

connectDB();

app.use("/api", userRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/movie", requireAuth, movieRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
