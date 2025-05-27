const {addBookHandler, getAllBooksHandler, getBookbyIdHandler, editbyNoteIdHandler} = require('./handler');

const routes = [
// Add books
	{
		method: 'POST',
		path: '/books',
		handler: addBookHandler,
	},
	// Get all books
	{
		method: 'GET',
		path: '/books',
		handler: getAllBooksHandler,
	},
	// Get book details by ID
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: getBookbyIdHandler,
	},
	// Change book details
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: editbyNoteIdHandler,
	},
	// Delete book
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler() {
		},
	},
];

module.exports = routes;
