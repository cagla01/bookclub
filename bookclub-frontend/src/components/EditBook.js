import React, { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditBook.css';

const EditBook = () => {
    const [book, setBook] = useState(null);
    const [updatedBook, setUpdatedBook] = useState({ title: '', author: '', description: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const { bookId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        request("GET", `/api/books/${bookId}`)
            .then((response) => {
                setBook(response.data);
                setUpdatedBook({
                    title: response.data.title,
                    author: response.data.author,
                    description: response.data.description,
                });
            })
            .catch((error) => {
                console.error("Error fetching book:", error);
                setErrorMessage("Failed to load book details.");
            });
    }, [bookId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedBook({ ...updatedBook, [name]: value });
    };

    const handleEditBook = (e) => {
        e.preventDefault();
        if (!updatedBook.title || !updatedBook.author || !updatedBook.description) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        request("PUT", `/api/books/${bookId}`, updatedBook)
            .then(() => navigate('/voting'))
            .catch((error) => {
                console.error("Error editing book:", error);
                setErrorMessage("An error occurred while editing the book.");
            });
    };

    const handleCancel = () => navigate("/voting");

    if (!book) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <h2 id="editBookTitle" className="text-center mb-4">Edit Book</h2>
                <div id="editBookCard" className="card shadow-sm">
                    <div className="card-body">
                        {errorMessage && (
                            <div className="alert alert-danger text-center" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleEditBook}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={updatedBook.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="author" className="form-label">Author</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    className="form-control"
                                    value={updatedBook.author}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    value={updatedBook.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button id="saveChanges" type="submit" className="btn btn-primary">
                                    <i className="bi bi-check-circle me-2"></i>Save Changes
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    <i className="bi bi-x-circle me-2"></i>Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBook;
