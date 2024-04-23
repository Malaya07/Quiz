const express = require('express');
const { connectToMongoDB } = require('./connect');
const userRoute = require("./routes/user");
const path = require("path");
const inroute = require("./routes/inroute");
const auth = require("./middlewares/auth");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const userscore = require("./models/userscore");
const User=require("./models/dburl")

const app = express();
const PORT = process.env.PORT || 8000; 
const SECRET_KEY = "PRACTICE";

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectToMongoDB("mongodb+srv://beastkiller571:<beasthunter>@cluster0.ws5pr9w.mongodb.net/")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error(err));

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/signin", (req, res) => res.render("signin"));
app.get("/hello", auth, (req, res) => res.json({ message: "hello" }));
app.get('/leaderboard', async (req, res) => {
  try {
      // Fetch leaderboard data
      const leaderboard = await getLeaderboard();
      res.render('leaderboard',{ leaderboard });
  } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


// Routes for user signup and signin
app.use("/signup", userRoute);
app.use("/signin", inroute);

app.post("/signin",inroute)

// Endpoint to handle POST requests containing score data
app.post('/api/scores', auth, async (req, res) => {
  const { score } = req.body;
  const token = req.cookies.logintoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let id;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    id = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const newScore = new userscore({
    id: id,
    score: score
  });

  try {
    await newScore.save();
    return res.json({ message: 'Score saved successfully' });
  } catch (err) {
    console.error('Error saving score:', err);
    return res.status(500).json({ error: 'Failed to save score' });
  }
});

async function getLeaderboard() {
  try {
      // Aggregate scores and group them by user ID
      const leaderboard = await userscore.aggregate([
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


app.listen(PORT, () => console.log("Server started at 8000"));
