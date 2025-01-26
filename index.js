const express = require('express');
const { readSync } = require('fs');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const { userInfo } = require('os');
const app = express();
require(dotenv).config();
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

const mongoURI=process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error("Error connecting to MongoDB: ", err));
  const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  });
  const UserSchema1 = new mongoose.Schema({
    book:String,
    review:String
  });
  const User = mongoose.model('User', UserSchema);
  const book1 = mongoose.model('BOOK', UserSchema1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+"/login.html");
})
app.use('/review',async(req,res,next)=>{
  const {book,review}=req.body;
  const newUser = new book1({ book, review });
  await newUser.save();
res.send("Registered Successfully");
next();
})
app.post('/displayreview',async(req,res)=>{
  const{book}=req.body;
  const user1 = await book1.find({book});
  res.render('index',{user1});
})
app.post('/register', async(req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.sendFile(__dirname+"/course1.html");
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

app.post('/login',async (req,res)=>{
    const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.sendFile(__dirname+"/course1.html");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html')
})
const server = app.listen(process.env.PORT||10000, () => {
  console.log("Server on");
});
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Connected...')
  socket.on('message', (msg) => {
      socket.broadcast.emit('message', msg)
  })

})

