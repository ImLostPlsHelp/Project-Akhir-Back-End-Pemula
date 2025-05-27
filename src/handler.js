const {nanoid} = require('nanoid');
const books = require('./books');

// Add book
const addBookHandler = (request, h) => {
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

	if (!name || name.trim() === '') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
			name,
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	if (!Number.isInteger(Number(year)) || Number(year) < 0) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Tahun harus berupa angka bulat positif',
		});
		response.code(400);
		return response;
	}

	if (typeof reading !== 'boolean') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Reading harus berupa boolean (true/false)',
		});
		response.code(400);
		return response;
	}

	if (typeof pageCount !== 'number' || pageCount < 0 || typeof readPage !== 'number' || readPage < 0) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. pageCount dan readPage harus berupa angka positif',
		});
		response.code(400);
		return response;
	}

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);

	const response = h.response({
		status: 'success',
		message: 'Buku berhasil ditambahkan',
		data: {
			bookId: id,
		},
	});
	response.code(201);
	return response;
};

// Get all books
const getAllBooksHandler = (request, h) => {
	const response = h.response({
		status: 'success',
		data: {
			books: books.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});
	response.code(200);
	return response;
};

// Get book details by ID
const getBookbyIdHandler = (request, h) => {
	const {bookId} = request.params;
	const book = books.find(b => b.id === bookId);

	if (!book) {
		const response = h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		});
		response.code(404);
		return response;
	}

	const response = h.response({
		status: 'success',
		data: {
			book,
		},
	});
	response.code(200);
	return response;
};

module.exports = {addBookHandler, getAllBooksHandler, getBookbyIdHandler};
