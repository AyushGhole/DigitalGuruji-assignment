import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Declaring cloud databases
const dbUrl = process.env.ATLAS_URL;

// MongoDb Connection
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log("connection error", err);
  });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.post("/generate", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  // Generatsve API Key Calling
  const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Provide me the article on ${title} in short and effective in a para.`;

  // Simulate AI API response
  const results = await model.generateContent(prompt);

  const generatedContent = JSON.stringify(results.response.text());

  const newArticle = new Article({ title, content: generatedContent });
  await newArticle.save();
  res.json(newArticle);
});

app.post("/optimize", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Article ID is required" });

  let articleInfo = await Article.findById(id);
  if (!articleInfo) return res.status(404).json({ error: "Article not found" });

  // Generattive API Key Calling
  const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Provide me the article on ${articleInfo.title} in short and effective in a para.`;

  // Generate AI API response
  const results = await model.generateContent(prompt);

  const mssg = JSON.stringify(results.response.text());
  articleInfo.content = mssg;

  await articleInfo.save();
  res.json(articleInfo);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
