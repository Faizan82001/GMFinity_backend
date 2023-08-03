// jwtAuthMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ error: "Authorization token not found." });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Login to continue" });
    }
};

module.exports = requireAuth;
