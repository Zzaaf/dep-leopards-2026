const PostService = require('../services/Post.service');
const formatResponse = require('../utils/formatResponse');

class PostController {
    // C
    static async createPost(req, res) {
        try {
            const { title, content } = req.body;
            const { user } = res.locals;
            const userId = user && user.id;
            if (userId == null) {
                return res.status(401).json(formatResponse(401, 'Invalid session: user id missing', null));
            }
            const newPost = await PostService.createPost({ title, content, user_id: userId });
            res.status(201).json(formatResponse(201, 'Post created success', newPost));
        } catch (error) {
            res.status(500).json(formatResponse(500, error.message, null, error));
        }
    }

    // R
    static async getAllPosts(req, res) {
        try {
            const allPosts = await PostService.getAllPosts();
            res.status(200).json(formatResponse(200, 'All Posts Without MetaData', allPosts));
        } catch (error) {
            res.status(500).json(formatResponse(500, error.message, null, error));
        }
    }

    static async getPostById(req, res) {
        try {
            const { id } = req.params;
            const post = await PostService.getPostById(id);
            if (!post) {
                return res.status(404).json(formatResponse(404, 'Post not found', null));
            }
            return res.status(200).json(formatResponse(200, 'Post', post));
        } catch (error) {
            res.status(500).json(formatResponse(500, error.message, null, error));
        }
    }

    // U
    static async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const { user } = res.locals;
            const updated = await PostService.updatePost(id, user.id, { title, content });
            if (updated.error === 'not_found') {
                return res.status(404).json(formatResponse(404, 'Post not found', null));
            }
            if (updated.error === 'forbidden') {
                return res.status(403).json(formatResponse(403, 'Only the author can edit this post', null));
            }
            return res.status(200).json(formatResponse(200, 'Post updated success', updated));
        } catch (error) {
            res.status(500).json(formatResponse(500, error.message, null, error));
        }
    }

    // D
    static async deletePost(req, res) {
        try {
            const { id } = req.params;
            const { user } = res.locals;
            const result = await PostService.deletePost(id, user.id);
            if (result.error === 'not_found') {
                return res.status(404).json(formatResponse(404, 'Post not found', null));
            }
            if (result.error === 'forbidden') {
                return res.status(403).json(formatResponse(403, 'Only the author can delete this post', null));
            }
            res.status(200).json(formatResponse(200, 'Post deleted success', result, null));
        } catch (error) {
            res.status(500).json(formatResponse(500, error.message, null, error));
        }
    }
}

module.exports = PostController;
