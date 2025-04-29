const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Create Route
router.post("/create-user", userController.createUser);

// Read Route
router.get("/read-user", userController.readUser);

// Update Route
router.put("/update-user", userController.updateUser);

// Delete Route
router.delete("/delete-user", userController.deleteUser);

// Get All Users
router.get("/all-users", userController.getAllUsers);

// Get User by ID
router.get("/user/:id", userController.getUserById);

// User Login
router.post("/login", userController.loginUser);

// User Logout
router.post("/logout", userController.logoutUser);

// Additional Routes
router.put("/change-password", userController.changePassword);
router.put("/update-profile", userController.updateProfile);
router.put("/make-admin/:id", userController.makeAdmin);
router.put("/remove-admin/:id", userController.removeAdmin);
router.get("/search", userController.searchUsers);
router.get("/filter", userController.filterUsers);
router.patch("/block-user/:id", userController.blockUser);
router.patch("/unblock-user/:id", userController.unblockUser);
router.post("/verify-email", userController.verifyEmail);
router.post("/resend-verification", userController.resendVerification);
router.post("/upload-profile-picture", userController.uploadProfilePicture);
router.delete("/delete-account", userController.deleteAccount);

module.exports = router;
