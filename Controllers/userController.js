const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAndUpdateUser = async (req, res) => {
    try {
        const { id, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (id) {
            const existingUser = await User.findById(id);
            if (!existingUser) {
                return res.status(404).json({ error: "User not found." });
            }

            existingUser.username = username;
            existingUser.email = email;
            existingUser.password = hashedPassword;

            const updatedUser = await existingUser.save();
            res.status(200).json(updatedUser);
        } else {
            if (!username || !email || !password) {
                return res
                    .status(400)
                    .json({ error: "All fields are required." });
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res
                    .status(400)
                    .json({ error: "Email is already registered." });
            }

            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res
                    .status(400)
                    .json({ error: "Username is already taken." });
            }

            if (password.length < 6) {
                return res
                    .status(400)
                    .json({
                        error: "Password should be at least 6 characters long.",
                    });
            }

            const newUser = new User({ username, email, password: hashedPassword });
            console.log(newUser)
            const user = await newUser.save();
            res.status(201).json(user);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating/updating user" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error during login." });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.header("Authorization");

        if (token) {
            const decodedToken = jwt.decode(token);
            const expTime = Math.floor(Date.now() / 1000) + 1;
            decodedToken.exp = expTime;
            const updatedToken = jwt.sign(decodedToken, process.env.JWT_SECRET);
            res.status(200).json({
                message: "Logout successful.",
                token: updatedToken,
            });
        } else {
            res.status(200).json({ message: "Logout successful." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error logging out." });
    }
}

module.exports = { createAndUpdateUser, login, logout };
