const multer = require("multer");
const express = require("express");
const router = express.Router();
const Skill = require("./models/Skill"); // Assuming Skill is a Mongoose model

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000 * 1024 * 1024 }, // 1000MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["video/mp4", "application/pdf"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Invalid file type. Only MP4 and PDF files are allowed."));
        }
        cb(null, true);
    }
});

router.post("/teach-skill", upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'demoVideo', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
    try {
        const { skillName, category, level, description, availability, skillCoins } = req.body;

        if (!skillName || !category || !level || !description || !availability || !skillCoins) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.files || !req.files.video) {
            return res.status(400).json({ message: "Video upload is required" });
        }

        const videoFile = req.files.video[0];
        const newSkill = new Skill({
            skillName,
            category,
            level,
            description,
            availability,
            skillCoins: parseInt(skillCoins),
            video: {
                data: videoFile.buffer,
                contentType: videoFile.mimetype
            }
        });

        if (req.files.demoVideo) {
            const demoVideoFile = req.files.demoVideo[0];
            newSkill.demoVideo = {
                data: demoVideoFile.buffer,
                contentType: demoVideoFile.mimetype
            };
        }

        if (req.files.pdf) {
            const pdfFile = req.files.pdf[0];
            newSkill.pdf = {
                data: pdfFile.buffer,
                contentType: pdfFile.mimetype
            };
        }

        await newSkill.save();
        res.status(201).json({ message: "Skill saved successfully!" });
    } catch (error) {
        console.error("Error saving skill:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

document.getElementById("teachSkillForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("skillName", document.getElementById("skillName").value.trim());
    formData.append("category", document.getElementById("category").value);
    formData.append("level", document.getElementById("level").value);
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("availability", document.getElementById("availability").value.trim());
    formData.append("skillCoins", document.getElementById("skillCoins").value.trim());

    const videoFile = document.getElementById("video").files[0];
    if (!videoFile) {
        alert("Please upload a video file.");
        return;
    }
    formData.append("video", videoFile);

    const demoVideoFile = document.getElementById("demoVideo").files[0];
    if (demoVideoFile) {
        formData.append("demoVideo", demoVideoFile);
    }

    const pdfFile = document.getElementById("pdf").files[0];
    if (pdfFile) {
        formData.append("pdf", pdfFile);
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to log in first!");
        window.location.href = "firstpage.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5001/api/teach-skill", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert("Skill submitted successfully!");
            document.getElementById("teachSkillForm").reset();
        } else {
            alert(`Error: ${result.message || "Failed to submit skill"}`);
        }
    } catch (error) {
        console.error("Error submitting skill:", error);
        alert("Error submitting skill. Please try again.");
    }
});

// In your login form handler
async function handleLogin(email, password) {
    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token to localStorage
            localStorage.setItem('token', data.token);
            console.log('Token saved:', data.token);
            window.location.href = 'mainpage.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error during login. Please try again.');
    }
}
