const express = require("express");
const path = require("path");
const userModel = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async (req, res) => {
  const users = await userModel.find();
  res.render("read", { users });
});

app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;
  const user = await userModel.create({
    name,
    email,
    image,
  });
  // res.send(`<a href="/">🔙</a> <br/> user: ${user.name} created successfully ✅`);
  res.redirect("/read");
});

app.get("/delete/:user", async (req, res) => {
    const leavingUser = await userModel.findOneAndDelete({_id: req.params.user});
//   const leavingUser = await userModel.findOne({ _id: req.params.user });
  res.send(
    `<a href="/read">🔙</a> <br/> Sad to see you go ${leavingUser.name}🥲`
  );
});

app.get("/edit/:id", async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });
  res.render("edit", { user });
});

app.post("/update/:id", async (req, res) => {
  const { name, email, image } = req.body;
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, email, image },
    { new: true }
  );
  res.redirect("/read");
});

app.listen(3000, (req, res) => {
  console.log("app is listening at port 3000 ✅");
});
