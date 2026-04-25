import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "No message received" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Jarvis, a smart AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: "OpenAI Error: " + data.error.message });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Jarvis backend running");
});

app.listen(3000, () => console.log("Server running"));
