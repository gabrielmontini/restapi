const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const axios = require('axios');
const{ registerValidation, loginValidation } = require('../validation');

//register
router.post('/register', async (req, res) => {

//validate before creation
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if there is a user with same email
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    }catch(err){
        res.status(400).send(err);
    }
    
});


router.get('/posts', async(req, res) => {
    console.log('Usuário');
    try {
    const livros = await axios.get('http://127.0.0.1:3001/posts/')
      res.status(201).send({
          message: "Book created.",
          data: {
              ...livros.data
          }
      });
  } catch (e) {
      console.log(e);
      res.status(500).send({
          message: "Error processing request."
      });
  }
});


//login
router.post('/login', async(req, res) => {

    //validation
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

        //Checking if there is a user with same email
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Email does not exists');

        //Checking if password is ok
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid Password');

        //Create and assign token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send(token);


});


module.exports = router;