const Blog = require('../models/Blog');

const initialBlogs = [
	{
		title: 'Wet food bulemia',
		author: 'Orange Kitty',
		url: 'http://www.wetfoodstinks.com',
		likes: 1,
	},

	{
		title: 'Catnip review',
		author: 'Ma',
		url: 'http://www.catnipreviews.com',
		likes: 3,
	},

	{
		title: 'wet vs dry food',
		author: 'Ma',
		url: 'http://www.catnipreviews.com',
		likes: 3,
	},
];

const nonExistingId = async () => {
	const blog = new Blog({ content: 'willremovethissoon', date: new Date() });
	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
};
