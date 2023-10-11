const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');   
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://user1:Welcome1@clusternodejs.jwg8lym.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define a MongoDB schema and model for user data
const userSchema = new mongoose.Schema({
    yourname: String,
    username: String,
    password: String,
  });

  const User = mongoose.model('User', userSchema);


  app.get('/', async (req, res) => {
  try {
    // Fetch a user from your database (replace with your logic)
    const user = await User.findOne({ username: 'chx@gmail.com' });

    // Render the 'index.ejs' template with user data
    res.render('index.ejs', { user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/signin', async (req, res) => {
  try {
    const { yourname, username, password } = req.body;

    // Create a new user document
    const user = new User({ yourname, username, password });

    // Save the user to the database
    await user.save();

    // Redirect to the signin.ejs page
    res.render('signin.ejs', { user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Handle the DELETE request
app.post('/delete', async (req, res) => {
  try {
    const userIdToDelete = req.body.userId;
    var xId=userIdToDelete;
    // Delete the user based on the provided ID
    const result = await User.deleteOne({ _id: userIdToDelete });

    if (result.deletedCount === 1) {
      
      res.render('userDeleted.ejs', { xId }); // Redirect after successful deletion
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle the UPDATE request
app.get('/retrieve', async (req, res) => {
  try {
    const userIdToUpdate = req.params.userId; // Get the user ID from the URL

    // Extract the updated user data from the request body
    const { yourname, username, password } = req.body;

    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userIdToUpdate,
      { yourname, username, password },
      { new: true } // Return the updated user
    );

    if (updatedUser) {
      res.json(updatedUser); // Respond with the updated user data
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });