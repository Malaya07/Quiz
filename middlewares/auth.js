const jwt = require("jsonwebtoken");
const SECRET_KEY = "PRACTICE";
const cookie = require('cookie-parser');
const QuizScore = require('../models/userscore'); // Assuming you have a QuizScore model

// Middleware function to check authentication and quiz attempt
const auth = async (req, res, next) => {
    // Check if the authentication cookie exists
    const token = req.cookies.logintoken;

    if (token) {
        // Token exists, verify its validity
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                // Token is invalid
                res.status(401).send("Unauthorized: Invalid token");
            } else {
                // Token is valid, check if the user has attempted the quiz today
                const userId = decoded.userid; // Assuming the token contains user ID
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

                try {
                    const recentAttempt = await QuizScore.findOne({
                        userid: userId,
                        date: { $gte: today }
                    });
                    if (recentAttempt) {
                        res.status(403).send("Forbidden: You have already attempted the quiz today");
                    } else {
                        // User is allowed to proceed
                        req.user = decoded; // Set user information on the request object
                        next(); // Proceed to the next middleware or route handler
                    }
                } catch (error) {
                    console.error('Error checking quiz attempt:', error);
                    res.status(500).send("Internal Server Error");
                }
            }
        });
    } else {
        // Authentication cookie is missing
        res.status(401).send("Unauthorized: Authentication cookie not found");
    }
};

module.exports = auth;
