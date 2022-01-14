const express = require("express");
const {
  loadUsers,
  addUser,
  getUser,
  depositToUser,
  updateCredit,
  withdrawFunds,
  transferFunds,
} = require("./utils/userUtils");

const app = express();

app.use(express.json());

//Get list of users
app.get("/users", (req, res) => {
  try {
    res.status(200).send(loadUsers());
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
//Get specific user
app.get("/users/:id", (req, res) => {
  try {
    res.status(200).send(getUser(req.params.id));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
//Add a user
app.post("/users", (req, res) => {
  try {
    res.status(201).send(addUser(req.body));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
//Deposit funds
app.put("/deposit/:id", (req, res) => {
  try {
    res.status(200).send(depositToUser(req.params.id, req.body.amount));
  } catch (e) {
    res.status(400).send({ e: e.message });
  }
});
//Update clients credit
app.put("/credit/:id", (req, res) => {
  try {
    res.status(200).send(updateCredit(req.params.id, req.body.amount));
  } catch (e) {
    res.status(400).send({ e: e.message });
  }
});
//Withdraw funds from client
app.put("/withdraw/:id", (req, res) => {
  try {
    res.status(200).send(withdrawFunds(req.params.id, req.body.amount));
  } catch (e) {
    res.status(400).send({ e: e.message });
  }
});
//Transfer funds from client to recipient
app.put("/transfer/:id", (req, res) => {
  try {
    res
      .status(200)
      .send(transferFunds(req.params.id, req.body.recipient, req.body.amount));
  } catch (e) {
    res.status(400).send({ e: e.message });
  }
});
//WILDCARD
const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
