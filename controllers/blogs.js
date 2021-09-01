const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id);

	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}
	const user = await User.findById(decodedToken.id);

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes ? body.likes : 0,
		user: user._id,
		comments: body.comments,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body;

	const blog = {
		title: body.title,
		likes: body.likes,
		url: body.url,
		user: body.user,
		author: body.author,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});
	response.status(200).json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
	const body = request.body;

	const blog = await Blog.findById(request.params.id);
	console.log(blog);
	if (blog) {
		blog.comments = blog.comments.concat(body);
		const savedBlog = await blog.save();
		await savedBlog
			.populate({ path: 'user', select: ['name', 'username'] })
			.execPopulate();
		response.status(200).json(savedBlog.toJSON());
	} else {
		response.status(404).end();
	}
});

module.exports = blogsRouter;
