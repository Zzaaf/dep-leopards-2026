const router = require('express').Router();
const usersRoutes = require('./users.routes');
const postsRoutes = require('./posts.routes');
const authRoutes = require('./auth.routes');
const tokensRoutes = require('./tokens.routes');

router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/auth', authRoutes);
router.use('/tokens', tokensRoutes);

module.exports = router;