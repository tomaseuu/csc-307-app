import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const generateRandomId = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";

  let randomLetters = "";
  for (let i = 0; i < 3; i++) {
    randomLetters += letters[Math.floor(Math.random() * letters.length)];
  }

  let randomDigits = "";
  for (let i = 0; i < 3; i++) {
    randomDigits += digits[Math.floor(Math.random() * digits.length)];
  }

  return randomLetters + randomDigits;
};

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter((user) => {
    return (
      (name === undefined || user["name"] === name) &&
      (job === undefined || user["job"] === job)
    );
  });
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  } else {
    return false;
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  let result = findUsersByNameAndJob(name, job);

  if (result.length === 0) {
    result = { users_list: [] };
  } else {
    result = { users_list: result };
  }

  res.send(result);
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateRandomId();
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const wasDeleted = deleteUserById(id);
  if (wasDeleted) {
    res.status(204).send(`User with id ${id} deleted.`);
  } else {
    res.status(404).send("Resource not found.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
