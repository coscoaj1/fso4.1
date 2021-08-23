const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

afterAll(() => {
	mongoose.connection.close();
});

test('there are two blogs', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('unique identifier of blog posts is named id', async () => {
	const response = await api.get('/api/blogs');
	console.log(response.body);

	expect(response.body.id).toBeDefined;
});

describe('Addition of a new blog', () => {
	let headers;

	beforeEach(async () => {
		const newUser = {
			username: 'root',
			name: 'root',
			password: 'password',
		};

		await api.post('/api/users').send(newUser);

		const result = await api.post('/api/login').send(newUser);

		headers = {
			Authorization: `bearer ${result.body.token}`,
		};
	});

	test('http post request creates a new blog post', async () => {
		const newBlog = {
			title: 'how to get insurance money',
			author: 'WhiteKitty',
			url: 'www.insurancefraud.com',
			likes: 99,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(200)
			.set(headers)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
	});

	test('if "likes" property is missing, will default to 0', async () => {
		const newBlog = {
			title: 'catfishing',
			author: 'Ma',
			url: 'https://www.alfame.com/blog/master-data-management',
		};

		const addedBlog = await api
			.post('/api/blogs')
			.send(newBlog)
			.set(headers)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		console.log(addedBlog.body);
		expect(addedBlog.body.likes).toBe(0);
	});

	test("invalid blog can't be added", async () => {
		const newBlog = {
			author: 'Orange Kitty',
		};

		await api
			.post('/api/blogs') //
			.send(newBlog)
			.set(headers)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test("blog can't be added without token", async () => {
		const newBlog = {
			title: 'catfishing',
			author: 'Ma',
			url: 'https://www.alfame.com/blog/master-data-management',
		};

		await api
			.post('/api/blogs') //
			.send(newBlog)
			.expect(401);

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});
