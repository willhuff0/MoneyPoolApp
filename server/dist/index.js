import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// --- Mongo connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Mongo connected"))
    .catch(err => console.error("Mongo error:", err));
// --- Example model ---
import mongoosePkg from "mongoose";
const todoSchema = new mongoosePkg.Schema({
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
}, { timestamps: true });
const Todo = mongoosePkg.model("Todo", todoSchema);
// --- REST routes ---
app.get("/api/todos", async (_req, res) => {
    const items = await Todo.find().sort({ createdAt: -1 });
    res.json(items);
});
app.post("/api/todos", async (req, res) => {
    const created = await Todo.create({ text: req.body.text });
    res.status(201).json(created);
});
app.patch("/api/todos/:id", async (req, res) => {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});
app.delete("/api/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end();
});
// --- start server ---
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
