const fs = require("fs");

//Load users
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync("./db/users.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};
//Convert string to JSON
const stringToJson = (message, string, message2, string2) => {
  return JSON.stringify({ [message]: string, [message2]: string2 });
};
// const stringToJson = (message, string) => {
//   return JSON.stringify({ [message]: string });
// };
//Convert to JSON and Save users
const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("./db/users.json", dataJSON);
};

//Return a specific user using ID
const getUser = (id) => {
  const users = loadUsers();
  const user = users.find((user) => user.id === parseInt(id));
  if (!user) {
    throw new Error("User not found");
  }
  return stringToJson("client", user);
};
//Add a new user
const addUser = (body) => {
  if (!body.id) {
    throw new Error("Please provide a passport ID");
  }
  const users = loadUsers();
  users.find((user) => {
    if (user.id === body.id) {
      throw Error("A user with this ID already exist");
    }
  });
  //check if cash and credit were provided else create default amount
  const newUser = setDefaultAssets(body);
  users.push(newUser);
  saveUsers(users);
  return stringToJson("new-client", newUser);
};
//Deposit Funds to specific user
const depositToUser = (id, amount) => {
  const users = loadUsers().filter((user) => user.id != id);
  const user = JSON.parse(getUser(id)).client;
  user.cash += parseInt(amount);
  users.push(user);
  saveUsers(users);
  return stringToJson("client", user);
};
//Update clients credit
const updateCredit = (id, amount) => {
  if (!parseInt(amount) || amount < 0) {
    throw Error("Invalid amount");
  }
  const parsedAmount = parseInt(amount);
  const users = loadUsers().filter((user) => user.id != id);
  const user = JSON.parse(getUser(id)).client;
  user.credit = parsedAmount;
  users.push(user);
  saveUsers(users);
  return stringToJson("client", user);
};
//Check if transaction exceeds limit
const limitReached = (id, amount) => {
  if (!parseInt(amount)) {
    throw Error("Invalid amount");
  }
  const users = loadUsers();
  const user = JSON.parse(getUser(id)).client;
  const balance = user.cash + parseInt(user.credit);
  if (amount > balance) {
    throw Error("Transaction exceeds limit");
  }
  return { user, users };
};
//Withdraw
const withdrawFunds = (id, amount) => {
  const { users, user } = limitReached(id, amount);
  const parsedAmount = parseInt(amount);
  const filteredUsers = users.filter((user) => user.id != id);
  user.cash -= parsedAmount;
  filteredUsers.push(user);
  saveUsers(filteredUsers);
  return stringToJson("client", user);
};
//Transfer

const transferFunds = (id, recipientID, amount) => {
  const recipient = getUser(recipientID);
  const user = JSON.parse(withdrawFunds(id, amount)).client;
  const rec = JSON.parse(depositToUser(recipientID, amount)).client;
  const users = loadUsers();
  console.log(user, rec, users);
  const filteredUsers = users.filter(
    (user) => user.id != recipientID && user.id != id
  );
  filteredUsers.push(user, rec);
  saveUsers(filteredUsers);
  return stringToJson("client", user, "recipient", rec);
};
//Check if provided cash/credit else provide default value of 0
const setDefaultAssets = (newUser) => {
  const updatedUser = { ...newUser };
  if (!updatedUser.cash) {
    updatedUser.cash = 0;
  }
  if (!updatedUser.credit) {
    updatedUser.credit = 0;
  }
  return updatedUser;
};

module.exports = {
  loadUsers,
  addUser,
  getUser,
  depositToUser,
  updateCredit,
  withdrawFunds,
  transferFunds,
};

// const transferFunds = (id, recipientID, amount) => {
//   const recipient = JSON.parse(getUser(recipientID)).client;
//   console.log(recipient, id);
//   const { users, user } = limitReached(id, amount);
//   const parsedAmount = parseInt(amount);
//   const filteredUsers = users.filter(
//     (user) => user.id != recipientID && user.id != id
//   );
//   user.cash -= parsedAmount;
//   recipient.cash += parsedAmount;
//   filteredUsers.push(user, recipient);
//   saveUsers(filteredUsers);
//   return stringToJson("client", user, "recipient", recipient);
// };
