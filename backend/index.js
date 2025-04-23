require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");


const User = require("./models/user.model.js");
const TravelStory = require("./models/travelStory.model.js");
const { authenticateToken } = require("./utilities");


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

//geocode loactions
const geocodeLocations = async (locations, existingLocations = []) => {
    return Promise.all(
        locations.map(async (location) => {
            // If location is already an object with coordinates, return it as is
            if (typeof location === 'object' && location.latitude !== undefined) {
                return location;
            }

            // Convert to string if it's an object without coordinates
            const locationString = typeof location === 'object' ? location.location : location;

            // Check if this location already exists in existingLocations
            const existingLocation = existingLocations.find(
                existing => existing.location === locationString
            );

            // If location exists with coordinates, return the existing entry
            if (existingLocation && existingLocation.latitude !== null) {
                return existingLocation;
            }

            // Otherwise, geocode the new location
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search`,
                    {
                        params: {
                            q: locationString,
                            format: "json",
                        },
                        headers: {
                            'User-Agent': 'TravelStoryApp/1.0 (travelstoryapp123@gmail.com)',
                        },
                    }
                );
                const data = response.data;

                if (data && data.length > 0) {
                    return {
                        location: locationString,
                        latitude: parseFloat(data[0].lat),
                        longitude: parseFloat(data[0].lon),
                    };
                } else {
                    return { location: locationString, latitude: null, longitude: null };
                }
            } catch (error) {
                console.error(`Error geocoding location "${locationString}":`, error);
                return { location: locationString, latitude: null, longitude: null };
            }
        })
    );
};


// Creating account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration successful",
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.json({
        error: false,
        message: "Login successful",
        user: { fullName: user.fullName, email: user.email },
        accessToken,
    });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });
});

// Route to handle image upload
app.post("/image-upload", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No image uploaded" });
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(201).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Deleting an image
app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "imageUrl parameter is required" });
    }

    try {
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, 'uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.status(200).json({ error: false, message: "Image deleted successfully" });
        } else {
            res.status(404).json({ error: true, message: "Image not found" });
        }
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Serve static files from uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));


// Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));
    const defaultImg = `http://localhost:8000/assets/placeholder.jpg`;

    try {
        // Geocode all locations
        const geocodedLocations = await geocodeLocations(visitedLocation, []);


        // Create and save the travel story
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation: geocodedLocations,
            userId,
            imageUrl: imageUrl || defaultImg,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();
        res.status(201).json({ story: travelStory, message: "Added successfully" });
    } catch (error) {
        console.error("Error adding travel story:", error);
        res.status(400).json({ error: true, message: error.message });
    }
});

/*
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));
    const defaultImg = `http://localhost:8000/assets/placeholder.jpg`;

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl: imageUrl || defaultImg,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();
        res.status(201).json({ story: travelStory, message: 'Added successfully' });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});
*/


// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Edit travel story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));
    const defaultImg = `http://localhost:8000/assets/placeholder.jpg`;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }
        
        const existingLocations = travelStory.visitedLocation || [];
        const geocodedLocations = await geocodeLocations(visitedLocation, existingLocations);

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = geocodedLocations;
        travelStory.imageUrl = imageUrl || defaultImg;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: 'Update successful' });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Delete a travel story 
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        await travelStory.deleteOne();

        const filename = path.basename(travelStory.imageUrl);
        const filePath = path.join(__dirname, 'uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(200).json({ message: "Travel story deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//update ur fav travel story
app.put("/update-is-fav/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" }); // Fixed 'user' to 'res'
        }

        travelStory.isFavourite = isFavourite;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Update successful" }); // Corrected spelling of 'successful'
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// search travel stories
app.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status.json({ error: true, message: "query is required" });
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
              //  { visitedLocation: { $regex: query, $options: "i" } },
                {
                    visitedLocation: {
                        $elemMatch: { location: { $regex: query, $options: "i" } },
                    },
                },
            ],
        }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: searchResults });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
})



const PORT = 8000;


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log("App is listening on port:", PORT);
        });
    })
    .catch((error) => {
        console.error("Connection error:", error);
    });
// app.listen(8000);
module.exports = app;
