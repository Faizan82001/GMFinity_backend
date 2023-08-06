const axios = require("axios");

const searchMovie = async (req, res) => {
    try {
        const name = req.query.name;
        const year = req.query.year;
        const omdbApiUrl = `${process.env.OMDBAPIURL}/?t=${encodeURIComponent(
            name
        )}&y=${encodeURIComponent(year || "")}&apikey=${
            process.env.OMDBAPIKEY
        }`;
        const response = await axios.get(omdbApiUrl);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching Movie",
        });
    }
};

module.exports = { searchMovie };
