const router = require('express').Router();
const PostController = require('../controllers/Post.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken')

router.route('/')
    .get(verifyAccessToken, PostController.getAllPosts)
    .post(verifyAccessToken, PostController.createPost)

router.route('/:id')
    .get(verifyAccessToken, PostController.getPostById)
    .put(verifyAccessToken, PostController.updatePost)
    .delete(verifyAccessToken, PostController.deletePost);

module.exports = router;