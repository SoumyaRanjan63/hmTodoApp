const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { cleanUpAndValidate } = require("./utils/authUtils");
const userModel = require("./models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const { isAuth } = require("./middleWares/isAuth");
const todoModel = require("./models/todoModel");
const cors = require('cors');



const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;
const SALT = process.env.SALT;


mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDb connected.");
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  });

// middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use(
//     session({
//       secret: SECRET_KEY,
//       resave: false,
//       saveUninitialized: false,
//       store:store
//     })
// )
app.use(express.static("public"));
app.use(cors());

// routes

app.get("/", (req, res) => {
  return res.send("server is running");
});

app.get("/login", (req, res) => {
  return res.send("login");
});

app.get("/register", (req, res) => {
  return res.send("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password, username } = req.body;
  console.log({ name, email, password, username });
  //data validation
  try {
    await cleanUpAndValidate({ name, email, password, username });
  } catch (error) {

    return res.send({
      status: 400,
      error: error,
    });
  }

  try {
    // unique feilds should not be in DB

    const userEmailExists = await userModel.findOne({ email });
    if (userEmailExists) {
      return res.send({
        status: 400,
        message: "Email already exists",
        data: email,
      });
    }

    const userUsernameExists = await userModel.findOne({ username });
    if (userUsernameExists) {
      return res.send({
        status: 400,
        message: "Username already exists",
        data: username,
      });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(SALT)
    );
    // console.log(hashedPassword);

    //create a user in DB
    const userObj = new userModel({
      //schema, bodyData
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
    });

    const userDb = await userObj.save();
    res.send({
      status: 200,
      message: "User created successfully",

    })

    //  console.log(userDb)
    // return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const expiresIn = 15*24*3600; 

  if (!email || !password) {
    return res.send({
      status: 400,
      error:"Missing credential"
    })
  }
  try {
    let userDb = {};
    //find user with loginId
    if (validator.isEmail(email)) {
      //email
      userDb = await userModel.findOne({ email });
    } else {
      //username
      userDb = await userModel.findOne({ username: email });
    }

    if (!userDb) {
      return res.send({
        status: 400,
        error: "Login id not found, please register first",
      });
    }

    //password compare
    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) {
      return res.send({
        status: 400,
        error: "Password incorrect",
      });
    }
    const token = jwt.sign({
       userId: userDb._id, username: userDb.username, email: userDb.email
       }, process.env.jwttoken ,{expiresIn});

    //Session base Auth
    // req.session.isAuth = true;

    // Send the JWT token as response
    // res.json({ token });
    // req.session.user = {
    //   userId: userDb._id,
    //   username: userDb.username,
    //   email: userDb.email,
    // };

    return res.send({
      status: 200,
      message: "Login Successfull",
      data: {token,userDb}
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

})

app.get("/dashboard", isAuth, async (req, res) => {

  const username = req.user.username;

  try {
    const todos = await todoModel.find({ username: username })
    console.log(todos);

    return res.send({
      status: 200,
      message: "Todos fetched successfully",
      data: todos
    });
  } catch (err) {
    return res.send(err);
  }
});

// app.post("/logout", isAuth, (req, res) => {
//   req.session.destroy((err) => {
//     if (err) throw err;

//     return res.send({
//       status: 200,
//       message: "Logout Successfull",
//     });
//   });

// })

// Api for logout from all devices 
// app.post("/logout_from_all_devices", isAuth, async (req, res) => {

//   const username = req.session.user.username;

//   try {
//     const deleteSessionsCount = await sessionModel.deleteMany({ "session.user.username": username })

//     return res.send({
//       status: 200,
//       message: "Logout from all devices Successfull",
//       data: deleteSessionsCount
//     });
//   }
//   catch (err) {
//     return res.send({
//       status: 400,
//       message: "Database error",
//       error: err
//     });
//   }

// })

// create todo
app.post("/create_item", isAuth, async (req, res) => {

  // res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  //todo, username
  const todoText = req.body.todo;
  const username = req.user.username

  //data validation
  console.log(username);

  if (!todoText)
    return res.send({
      status: 400,
      error: "Missing todo text",
    });
  if (typeof todoText !== "string") {
    return res.send({
      status: 400,
      error: "Todo is not a string",
    });
  }
  if (todoText.length < 3 || todoText.length > 100) {
    return res.send({
      status: 400,
      error: "Todo length should be 3 to 100 characters only",
    });
  }

  const todoObj = new todoModel({
    todo: todoText,
    username: username,
    createdAt: new Date()
  })
  try {
    const todoDb = await todoObj.save();
    return res.send({
      status: 201,
      message: "Todo created successfully.",
      data: todoDb
    })
  }
  catch (err) {
    return res.send({
      status: 500,
      message: "Database error",
      error: err
    })
  }

})


// Editing 
app.post("/edit_item", isAuth, async (req, res) => {
  //  todoId,newData
  const { id, newData } = req.body;

  // data validation
  if (!id || !newData) {
    return res.send({
      status: 400,
      error: "Missing Credentials."
    })
  }

  if (newData.length < 3 || newData.length > 50) {
    return res.send({
      status: 400,
      error: "Todo length should be in 3-50 characters."
    })
  }

  try {
    const todoDb = await todoModel.findOne({ _id: id });
    if (!todoDb) {
      return res.send({
        status: 400,
        error: "Todo not found",
      });
    }

    //check ownership
    if (todoDb.username !== req.user.username) {
      return res.send({
        status: 401,
        error: "Not allowed to edit, authorization failed",
      });
    }

    //update the todo in DB
    const todoPrev = await todoModel.findOneAndUpdate(
      { _id: id },
      { todo: newData },
      { new: true }
    );

    return res.send({
      status: 200,
      message: "Todo updated successfully",
      data: todoPrev,
    });

  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

})


// Delete_item

app.post("/delete_item", isAuth, async (req, res) => {

  const { id } = req.body;

  // data validation
  if (!id) {
    return res.send({
      status: 400,
      error: "Missing Credentials."
    })
  }


  try {
    const todoDb = await todoModel.findOne({ _id: id });
    if (!todoDb) {
      return res.send({
        status: 400,
        error : "Todo not found",
      });
    }

    //check ownership
    if (todoDb.username !== req.user.username) {
      return res.send({
        status: 401,
        error: "Not allowed to delete, authorization failed",
      });
    }

    //Delete the todo in DB
    const todoPrev = await todoModel.findOneAndDelete({ _id: id });

    return res.send({
      status: 200,
      message: "Todo deleted successfully",
      data: id,
    });

  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

})

// peginated API
// read-item?skip+15
// read-item
// app.get("/read-itemsr",async(req,res)=> {
//   const SKIP = req.query.skip || 0;
//   const LIMIT = process.env.LIMIT;
//   const username = req.session.user.username;

//   try{
//     const todoDb = await todoModel.aggregate([
//       //  pagination and isMatch
//        {
//         $match : {username:username}
//        },
//        {
//         $facet:{
//           data:[{$skip:parseInt(SKIP)},{$limit:parseInt(LIMIT)}]
//         }
//        }
//     ])
//      return res.send({
//       status:200,
//       message:message,
//       data:todoDb[0].data
//      })
//   }
//   catch(err){
//     return res.send({
//       status:400,
//       message:err.message
//     })
//   }
// })

app.listen(PORT, () => {
  console.log("server is running.");
  console.log(`http://localhost:${PORT}`);
});

// Steps to follow>.........

// Basic Express layout
// MondoDb connection

// Register page
// Registration API

// Login page
// Login API

// Session base Auth

// Dashboard page
// Logout
// Logout from all devices

// TODO API
// create
// edit
// delete
// read

// Dashboard
// Axios GET AND POST
// read component

// Pagination API
// Rate Limiting

// deployment
