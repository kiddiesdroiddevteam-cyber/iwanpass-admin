router.get('/api/users/', getAllUsers);

// GET /api/users/statistics - Get user statistics summary
router.get('/api/users/statistics', getUserStatistics);

// GET /api/users/active - Get only active users
router.get('/api/users/active', getActiveUsers);

// GET /api/users/:userId - Get specific user by ID
router.get('/api/users/:userId', getUserById);

// DELETE /api/users/:userId - Delete a user
router.delete('/api/users/:userId', deleteUser);