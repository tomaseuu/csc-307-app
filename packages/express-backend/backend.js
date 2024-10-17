import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./user.js";

mongoose
  .connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  let query = {};
  if (name) query.name = name;
  if (job) query.job = job;

  User.find(query)
    .then((users) => res.json({ users_list: users }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  User.create(userToAdd)
    .then((newUser) => res.status(201).json(newUser))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(204).send(`User with id ${id} deleted.`);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
