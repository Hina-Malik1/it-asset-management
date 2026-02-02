const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = 'mongodb+srv://hinamalik4_db_user:mVtSFMjvhOhqClf1@cluster0.ye9pby3.mongodb.net/asset-management?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = new User({
      username: 'admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await user.save();
    console.log('User created successfully!');
    process.exit();
  })
  .catch(err => console.log(err));