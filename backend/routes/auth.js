const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_Secret = "Vikrambetal";

// ROUTE 1 : Create a User using : POST "/api/auth/createuser" . No Login required
router.post('/createuser', [
  body('name', 'Enter a valid Name').isLength({ min: 3 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must be atleat 5 Characters').isLength({ min: 5 })
], async (req, res) => {
  let success = false;

  //If there are error then return Bad Request and Errors
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ result: result.array() });
  }
  // Check if the user with same email already exists
  try {

    let user = await User.findOne({ email: req.body.email });
    
    if (!user) {

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //Creation of New User
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });


    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_Secret);
    success=true;
    //  res.json(user)
    res.json({success, authtoken });  
  }

  else  {
          return res.status(400).json({ success,Error: "Sorry! A user with the same Email already exists." })
  }

  } catch (error) {
    console.log(error.messaage);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 2 :Authenticate a User using : POST "/api/auth/login" . No Login required

router.post('/login', [
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists()

], async (req, res) => {
  let success = false;
  //If there are error then return Bad Request and Errors
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ result: result.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      success =false;
      return res.status(400).json({ Error: "Please try to login with correct credentials." });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      success =false;
      return res.status(400).json({ Error: "Please try to login with correct credentials." });
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_Secret);
    success = true;
    res.json({ success,authtoken });

  } catch (error) {

    console.log(error.messaage);
    res.status(500).send("Internal Server Error");
  }

});

//ROUTE 3 :Get Logged in User details using : POST "/api/auth/getuser" . Login required

router.post('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")

    res.send(user);

  } catch (error) {
    console.log(error.messaage);
    res.status(500).send("Internal Server Error");
  }

});
module.exports = router;

