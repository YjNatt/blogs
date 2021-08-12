const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.get('/', async(req, res) => {
  const users = await User.find({}).populate('blogs');
  res.json(users);
});

userRouter.post('/', async(req, res) => {
  if (req.body.password.length <= 3) {
    return res.status(400).end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    passwordHash
  });

  const savedUser = await user.save();
  res.json(savedUser);
})

module.exports = userRouter;