const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const axios = require('axios');
    const dotenv = require("dotenv");
    const Skill = require("./models/Skill"); // ✅ Import Skill Model
    const skillCoinRoutes = require('./routes/skillCoinRoutes'); // Add this with your other requires


    dotenv.config();
    const app = express();

    // ✅ Middleware
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // ✅ Import Routes
    const authRoutes = require("./routes/authRoutes");
    const analyticsRoutes = require("./routes/analyticsRoutes");
    const teachSkillRoutes = require("./routes/teachSkillRoutes"); // ✅ Import the Teach Skill Routes

    // ✅ Use Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api", teachSkillRoutes); // ✅ Correct Usage
    app.use('/api', skillCoinRoutes); // Add this with your other app.use statements
    // ✅ Register the Teach Skill API

    // ✅ Connect to MongoDB
    // ✅ Set Default Database to 'TalentGrind'
    const DATABASE_NAME = "TalentGrind";  
    const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/${DATABASE_NAME}`;

    mongoose
        .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log(`✅ MongoDB Connected to Database: ${DATABASE_NAME}`);
        })
        .catch((err) => console.error("❌ MongoDB Connection Error:", err));

    // ✅ Start Server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    // API Endpoint to Fetch All Skills
    // ✅ Route to Fetch Skills based on Search Query
    // app.use("/api", skillCoinRoutes);  // Add this line

    app.get("/api/skills", async (req, res) => {
        try {
            const { search } = req.query;

            let filter = {};
            if (search) {
                filter = {
                    $or: [
                        { skillName: { $regex: search, $options: "i" } }, // Case-insensitive search in skillName
                        { description: { $regex: search, $options: "i" } } // Search in description
                    ]
                };
            }

            const skills = await Skill.find(filter); // Fetch filtered skills from MongoDB
            res.json(skills);
        } catch (error) {
            res.status(500).json({ error: "Error fetching skills" });
        }
    });
    app.use("/videos", express.static("videos")); // Folder named 'videos' inside your project root

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    
    // Top video analyzer endpoint
    app.get('/api/top-video', async (req, res) => {
      try {
        const API_KEY = process.env.YOUTUBE_API_KEY;
        const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    
        // Step 1: Get videos from the channel
        const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            key: API_KEY,
            channelId: CHANNEL_ID,
            part: 'snippet',
            maxResults: 20,
            order: 'date'
          }
        });
    
        const videoIds = searchRes.data.items.map(item => item.id.videoId).filter(Boolean);
    
        // Step 2: Get stats for those videos
        const statsRes = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            key: API_KEY,
            id: videoIds.join(','),
            part: 'statistics,snippet'
          }
        });
    
        const videos = statsRes.data.items;
    
        if (videos.length === 0) {
          return res.status(404).json({ error: "No videos found" });
        }
    
        const topVideo = videos.sort((a, b) => {
          return parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount);
        })[0];
    
        res.json({
          title: topVideo.snippet.title,
          views: topVideo.statistics.viewCount,
          likes: topVideo.statistics.likeCount,
          videoId: topVideo.id,
          thumbnail: topVideo.snippet.thumbnails.high.url
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching video data" });
      }
    });
