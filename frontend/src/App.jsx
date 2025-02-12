import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ArticleWriter() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [articleId, setArticleId] = useState(null);
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    if (content) {
      setDisplayedContent("");
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedContent((prev) => prev + content[index]);
        index++;
        if (index >= content.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [content]);

  const fetchArticle = async () => {
    if (!title) {
      alert("Please enter a title!");
      return;
    }

    setLoading(true);
    setContent("");

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate article");
      }

      setArticleId(data._id);
      setContent(data.content.trim());
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const optimizeArticle = async () => {
    if (!content) {
      alert("No content available to optimize!");
      return;
    }

    setOptimizing(true);
    try {
      const response = await fetch("http://localhost:5000/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: articleId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to optimize article");
      }

      setContent(data.content.trim());
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          ✨ AI TextEditor ✨
        </h2>
        <input
          type="text"
          placeholder="Enter a creative title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={fetchArticle}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 shadow-md"
            }`}>
            {loading ? "Generating..." : "Submit"}
          </button>
          <button
            onClick={optimizeArticle}
            disabled={optimizing || !content}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
              optimizing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 shadow-md"
            }`}>
            {optimizing ? "Optimizing..." : "Optimize"}
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-gray-100 mt-6 p-4 rounded-xl shadow-inner">
          <textarea
            value={displayedContent}
            readOnly
            placeholder="Generated content will appear here..."
            className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
