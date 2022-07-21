import Todo from "./models/Todo.js";
import User from "./models/User.js";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const num = '123';

await mongoose.connect('mongodb://localhost:27017/auth-todo', {useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error', console.log);

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({extended:true}));
app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000',
  // origin: '*',
  optionSuccessStatus:200,
}));

// app.get("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Max-Age", "1800");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
//    });

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/user', (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  const payload = jwt.verify(req.cookies.token, num);
  User.findById(payload.id)
    .then(userInfo => {
      if (!userInfo) {
        return res.json({});
      }
      res.json({id:userInfo._id,email:userInfo.email});
    });
});

app.post('/register', (req, res) => {
  const {email,password,userName} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({password:hashedPassword,email,userName});
  user.save().then(userInfo => {
    jwt.sign({id:userInfo._id,email:userInfo.email}, num, (err,token) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
      }
    });
  });
  // User.findOne({ email: email }, (err, user) => {
  //   if (email) {
  //     res.send({ message: "User already registered" });
  //   } else {
  //     const user = new User({
  //       userName,
  //       email,
  //       password,
  //     });
  //     user.save((err) => {
  //       if (err) {
  //         res.send(err);
  //       } else {
  //         res.send({ message: "Successfully Registered, Please login now." });
  //       }
  //     });
  //   }
  // });
});

app.post('/login', (req, res) => {
  const {email,password} = req.body;
  User.findOne({email})
    .then(userInfo => {
      if (!userInfo) {
        return res.sendStatus(401);
      }
      const passOk = bcrypt.compareSync(password, userInfo.password);
      if (passOk) {
        jwt.sign({id:userInfo._id,email},num, (err,token) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
});


app.post('/reset',(req,res) => {
  const {email, newPassword} = req.body;
  User.findOne({email})
  .then(userInfo => {
    if(!userInfo){
      return res.sendStatus(401);
    }
    userInfo.password = newPassword;
    userInfo.password.save((err) => {
      if(err) {
        console.log(err);
      }
    })
    
  })
}
  
)

app.post('/logout', (req, res) => {
  res.cookie('token', '').send();
});

app.get('/todos', (req,res) => {
  const payload = jwt.verify(req.cookies.token, num);
  Todo.where({user:new mongoose.Types.ObjectId(payload.id)})
    .find((err,todos) => {
      res.json(todos);
    })
});

app.put('/todos', (req, res) => {
  const payload = jwt.verify(req.cookies.token, num);
  const todo = new Todo({
    text:req.body.text,
    done:false,
    user:new mongoose.Types.ObjectId(payload.id),
  });
  todo.save().then(todo => {
    res.json(todo);
  })
});

app.post('/todos', (req,res) => {
  const payload = jwt.verify(req.cookies.token, num);
  Todo.updateOne({
    _id:new mongoose.Types.ObjectId(req.body.id),
    user:new mongoose.Types.ObjectId(payload.id)
  }, {
    done:req.body.done,
  }).then(() => {
    res.sendStatus(200);
  });
});

app.listen(4000);