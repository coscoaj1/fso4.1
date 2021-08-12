const countBy = require('lodash/countBy');
const each = require('lodash/forEach');

const palindrome = (string) => {
	return string.split('').reverse().join('');
};

const average = (array) => {
	const reducer = (sum, item) => {
		return sum + item;
	};

	return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

const totalLikes = (blogs) => {
	const reducer = (total, blog) => {
		return total + blog.likes;
	};

	return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const values = blogs.map((val) => val.likes);
	const max_value = Math.max(...values);

	return max_value;
};

const mostBlogs = (blogs) => {
	const authors = blogs.map((blog) => blog.author);
	const count = countBy(authors);

	let currentAuthor = {
		author: '',
		blogs: 0,
	};

	each(count, (blogs, author) => {
		if (blogs > currentAuthor.blogs) {
			currentAuthor.author = author;
			currentAuthor.blogs = blogs;
		}
	});
	return currentAuthor;
};

module.exports = {
	palindrome,
	average,
	totalLikes,
	favoriteBlog,
	mostBlogs,
};

//pre arrow function method

// blogs.reduce(function (total, blog) {
// 	return total + blog.likes;
// }, 0);
