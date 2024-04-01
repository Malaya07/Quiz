const QuizScore = require('../models/userscore');
const User = require('../models/dburl');
const ejs=require('ejs')
async function getLeaderboard() {
    try {
        // Aggregate scores and group them by user ID
        const leaderboard = await QuizScore.aggregate([
            {
                $group: {
                    _id: "$id",
                    totalScore: { $sum: "$score" },
                    count: { $sum: 1 } // Count number of attempts
                }
            },
            {
                $sort: { totalScore: -1 } // Sort by total score descending
            },
            {
                $limit: 10 // Limit to top 10 users
            }
        ]);

        // Populate user information for each score
        const populatedLeaderboard = await Promise.all(leaderboard.map(async (entry) => {
            const user = await User.findById(entry._id);
            return {
                name: user.name,
                email: user.email,
                totalScore: entry.totalScore,
                totalAttempts: entry.count
            };
        }));

        return populatedLeaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
}

// Usage example
getLeaderboard()
    .then(leaderboard => {
        console.log("Leaderboard:", leaderboard);
        
        // Do something with the leaderboard
    })
    .catch(error => {
        console.error
        ("Error:", error);
    });
