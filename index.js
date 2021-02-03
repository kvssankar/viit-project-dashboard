//TODO: add refresh eq in html for adding comments
const express = require("express");
const mongoose = require("mongoose");
const app = express();
var generator = require("generate-password");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO: capcha for comments
//TODO: email password to them
//TODO: add their passwords to an array in localstorage and check on clcik task if that password is present and then allow as commentor or admin
//TODO: calender api integrate
//TODO: PWA notifications
//TODO: Random avatar generator
//TODO: Same name email phone number in localstorage dont ask everytime, give option to reset
//TODO: Create organization if famous
//TODO: Auto generated whats app message to kshitij bhaiya
//TODO: If needed at the end make an admin panel (like a master password which can change any task)

const db =
  "mongodb+srv://kvssankar:u4I69QktIvLwOk7H@cluster1.uacfw.mongodb.net/vaccine?retryWrites=true&w=majority";
const connect = mongoose
  .connect(db, { useFindAndModify: false })
  .then(() => console.log("Mondo db connected...."))
  .catch((err) => console.log(err));

const taskSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  created_date: { type: Date, default: Date.now() },
  deadline_date: Date.UTC,
  description: String,
  comments: [
    {
      name: String,
      message: String,
      created_date: { type: Date, default: Date.now() },
    },
  ],
  status: Number,
  leader: String,
  team: [String],
  password: String,
});

const Task = mongoose.model("tasks", taskSchema);

app.get("/all", async (req, res) => {
  const all = await Task.find().sort({ created_date: 1 });
  res.json(all);
});

app.get("/my", async (req, res) => {
  const { passwords } = req.body;
  let my = [];
  for (var i = 0; i < passwords.length; i++) {
    let task = await Task.find({ password: passwords[i] });
    my.push(task);
  }
  res.json(my);
});

app.post("/create", async (req, res) => {
  var password = generator.generate({
    length: 10,
    numbers: true,
  });

  const newTask = new Task({ ...req.body, password });
  newTask.save();
});

app.post("/delete", async (req, res) => {
  const { name, password } = req.body;
  const exist = await Task.find({ name, password });
  if (!exist)
    return res.status(500).json({ mssg: "Incorrect title or password" });
  return res.json({ mssg: "Successfully deleted" });
});

app.post("/comment", async (req, res) => {
  const { name, message, _id } = req.body;
  const task = await Task.findByIdAndUpdate(
    _id,
    {
      $push: { comments: { name, message } },
    },
    { new: true }
  );
  res.json(task);
});

app.post("/addteamate", async (req, res) => {
  const { teammate, password, _id } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id, password },
    { $push: { team: teammate } },
    { new: true }
  );
  res.json(task);
});

//hold
app.post("/update", async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.body._id, password: req.body.password },
    { $set: { ...req.body } }
  );
});
