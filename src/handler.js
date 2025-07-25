const {nanoid} = require('nanoid');
const books = require('./books');

// Add book
const addBookHandler = (request, h) => {
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

	if (!name || name.trim() === '') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
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
	const {name, reading, finished} = request.query;
	let filteredBooks = books;

	if (name !== undefined) {
		filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
	}

	if (reading !== undefined) {
		if (reading === '0') {
			filteredBooks = filteredBooks.filter(book => !book.reading);
		} else if (reading === '1') {
			filteredBooks = filteredBooks.filter(book => book.reading);
		}
	}

	if (finished !== undefined) {
		if (finished === '0') {
			filteredBooks = filteredBooks.filter(book => !book.finished);
		} else if (finished === '1') {
			filteredBooks = filteredBooks.filter(book => book.finished);
		}
	}

	const response = h.response({
		status: 'success',
		data: {
			books: filteredBooks.map(book => ({
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

// Edit book details by ID
const editbyNoteIdHandler = (request, h) => {
	const {bookId} = request.params;
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

	const index = books.findIndex(b => b.id === bookId);
	if (index === -1) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}

	if (!name || name.trim() === '') {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	const updatedAt = new Date().toISOString();
	const finished = pageCount === readPage;
	const updatedBook = {
		...books[index],
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		updatedAt,
	};
	books[index] = updatedBook;
	const response = h.response({
		status: 'success',
		message: 'Buku berhasil diperbarui',
	});
	response.code(200);
	return response;
};

// Delete book by ID
const deleteBookHandler = (request, h) => {
	const {bookId} = request.params;
	const index = books.findIndex(b => b.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler, getAllBooksHandler, getBookbyIdHandler, editbyNoteIdHandler, deleteBookHandler,
};
