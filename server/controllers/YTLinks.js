const YTLink = require('../models/YTLink');


const extractVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    // Handle standard youtube.com URL
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
    // Handle youtu.be short URL
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
    return null;
  } catch (error) {
    return null;
  }
};

exports.addYTLink = async (req, res) => {
  try {
    const { courseId, url, description } = req.body;
    // console.log("courseId:", courseId, "url:", url, "description:", description);

    if (!courseId || !url) {
      return res.status(400).json({ message: "Course ID and URL are required." });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL." });
    }

    // Fetch video title and thumbnail
    const apiKey = process.env.YOUTUBE_API_KEY;
    const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
    const response = await fetch(ytApiUrl);
    const data = await response.json();
    
    // console.log("YouTube API response:", data); //debug

    if (!data.items || data.items.length === 0) {
      return res.status(400).json({ message: "Unable to retrieve video details. Check the video ID or API key." });
    }

    const videoData = data.items[0]?.snippet;
    if (!videoData) {
      return res.status(400).json({ message: "Unable to retrieve video snippet details." });
    }

    const videoTitle = videoData.title;
    const thumbnailUrl = videoData.thumbnails?.high?.url || videoData.thumbnails?.default?.url;

    const newYTLink = new YTLink({
      courseId,
      title: videoTitle,
      url,
      description,
      thumbnail: thumbnailUrl,
    });
    const savedYTLink = await newYTLink.save();

    res.status(201).json({ success: true, ytLink: savedYTLink });
  } 
  catch (error) {
    console.error("Error adding YouTube link:", error);
    res.status(500).json({ success: false, message: "Error adding YouTube link", error });
  }
};


// Get all YouTube links for a specific course
exports.getYTLinks = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const ytLinks = await YTLink.find({ courseId });
    res.status(200).json({ success: true, ytLinks });
  } 
  catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving YouTube links",
        error,
      });
  }
};

// Delete a YouTube link by its ID
exports.deleteYTLink = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Link ID is required." });
    }

    const deletedYTLink = await YTLink.findByIdAndDelete(id);

    if (!deletedYTLink) {
      return res
        .status(404)
        .json({ success: false, message: "YouTube link not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "YouTube link deleted successfully." });
  } 
  
  catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting YouTube link", error });
  }
};
