const express = require("express");
const app = express();
const main = require("./db");
const user = require("./user");
const validation = require("./validate");
const bcrypt = require("bcrypt");
app.use(express.json());

main()
  .then(() => {
    console.log("DB connected");

    app.listen(3000, () => {
      console.log("at 3000");
    });

    app.post("/reg", async (req, res) => {
      try {
        // Compulsory fields check
        validation(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await user.create(req.body);
        res.send("Added");
      } catch (err) {
        res.send(err.message);
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const people = await user.findById(req.body._id);
        if (!req.body.email === people.email) {
          throw new Error("Invalid login");
        }
        const pass = await bcrypt.compare(req.body.password, people.password);
        if (!pass) {
          throw new Error("Invalid login");
        }
        else{
          res.send("Login Successfull");
        }
      } catch (err) {
        res.send("Error :- " + err.message);
      }
    });

    app.get("/info", async (req, res) => {
      try {
        const result = await user.find({});
        res.send(result);
      } catch (err) {
        res.send(err);
      }
    });

    app.get("/info/:id", async (req, res) => {
      try {
        const id1 = req.params.id;
        const result = await user.findById(id1);
        res.send(result);
      } catch (err) {
        res.send(err);
      }
    });

    app.put("/user/:id", async (req, res) => {
      try {
        const id1 = req.params.id;
        const result = await user.findByIdAndUpdate(
          id1,
          {
            $set: {
              name: req.body.name,
              age: req.body.age,
              gender: req.body.gender,
              email: req.body.email,
            },
          },
          { new: true, runValidators: true } // returns the updated document
        );
        if (result) {
          res.send("updated");
        } else {
          res.send("Not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.delete("/user/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await user.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
          res.send("Deleted");
        } else {
          res.send("Not found");
        }
      } catch (err) {
        res.send(err);
      }
    });
  })
  .catch((err) => console.log(err));
