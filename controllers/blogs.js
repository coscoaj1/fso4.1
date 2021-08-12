const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.get('/:id', (request, response, next) => {
	Blog.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

blogsRouter.post('/', async (request, response) => {
	const body = request.body;

	if (!body.author || !body.url) {
		return response.status(400).json({ error: 'author and url are required' });
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes ? body.likes : 0,
	});
	const savedBlog = await blog.save();
	response.status(200).json(savedBlog);
});

blogsRouter.delete('/:id', (request, response, next) => {
	Blog.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

blogsRouter.put('/:id', (request, response, next) => {
	const body = request.body;

	const blog = {
		title: body.title,
	};

	Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
		.then((updatedBlog) => {
			response.json(updatedBlog);
		})
		.catch((error) => next(error));
});

module.exports = blogsRouter;
