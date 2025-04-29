const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller to create a user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });

    // Hash password
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};

// Controller to get a user by ID
exports.readUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User read successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error reading user', error: err });
  }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'All users fetched successfully', users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// Controller to get user by ID (for specific user details)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User fetched by ID', user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user by ID', error: err });
  }
};

// Controller to update a user
exports.updateUser = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
};

// Controller to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'be_secure', { expiresIn: '1h' });
    res.status(200).json({ message: 'User login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
};

// User logout (assuming simple logout, typically this is done on client-side)
exports.logoutUser = async (req, res) => {
  try {
    // Implementing logout on client-side is recommended (clear token)
    res.status(200).json({ message: 'User logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging out', error: err });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash new password and update
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password', error: err });
  }
};

// Update profile (e.g., name, email, profile picture)
exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, email, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, profilePicture }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User profile updated successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err });
  }
};

// Make a user an admin
exports.makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, { isAdmin: true }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User made admin successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error making user admin', error: err });
  }
};

// Remove admin role
exports.removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, { isAdmin: false }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Admin role removed successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error removing admin role', error: err });
  }
};

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;  // query will contain name or email to search
    const users = await User.find({
      $or: [{ name: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }]
    });
    res.status(200).json({ message: 'User search completed successfully', users });
  } catch (err) {
    res.status(500).json({ message: 'Error searching users', error: err });
  }
};

// Filter users (e.g., by admin status or blocked status)
exports.filterUsers = async (req, res) => {
  try {
    const { isAdmin, isBlocked } = req.query;
    const filters = {};
    if (isAdmin !== undefined) filters.isAdmin = isAdmin === 'true';
    if (isBlocked !== undefined) filters.isBlocked = isBlocked === 'true';

    const users = await User.find(filters);
    res.status(200).json({ message: 'User filter completed successfully', users });
  } catch (err) {
    res.status(500).json({ message: 'Error filtering users', error: err });
  }
};

// Block a user
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User blocked successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error blocking user', error: err });
  }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User unblocked successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error unblocking user', error: err });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.emailVerified = true;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying email', error: err });
  }
};

// Resend email verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Logic to send verification email here (e.g., using a third-party service)
    res.status(200).json({ message: 'Verification email resent' });
  } catch (err) {
    res.status(500).json({ message: 'Error resending verification email', error: err });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { userId, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile picture uploaded successfully', updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile picture', error: err });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting account', error: err });
  }
};
