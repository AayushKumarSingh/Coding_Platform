import express from "express";
import axios from "axios";

const router = express.Router();

// Fetch all questions
router.get("/all", async (req, res) => {
  try {
    const response = await axios.get("https://pink-pets-grab.loca.lt/api/problems/all");
    // Forward the full response to frontend
    res.json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

// Fetch single question by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://pink-pets-grab.loca.lt/api/problems/${id}`);
    // Forward only required fields
    const { title, description, difficulty, tags } = response.data;
    res.json({ title, description, difficulty, tags });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch problem" });
  }
});

export default router;
