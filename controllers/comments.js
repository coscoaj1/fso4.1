const commentsRouter = require('express').Router();
const Comment = require('../models/comments');

commentsRouter.post('/:id/comments', async (request, response) => {
	const body = request.body;
	const comment = new Comment({
		content: body.content,
	});

	const savedComment = await comment.save();
	response.json(savedComment);
});

commentsRouter.get('/:id/comments', async (request, response, next) => {
	const comments = await Comment.find({}).populate('comments');
	response.json(comments);
});
module.exports = commentsRouter;
