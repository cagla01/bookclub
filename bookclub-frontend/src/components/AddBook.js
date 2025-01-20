import React, { useState } from 'react';
import { request } from '../axios_helper';
import { useNavigate } from 'react-router-dom';
import './AddBook.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddBook = () => {
    const [newBook, setNewBook] = useState({ title: '', author: '', description: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newBook.title || !newBook.author || !newBook.description) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        request("POST", "/api/books", newBook)
            .then(() => {
                navigate("/voting");
            })
            .catch((error) => {
                console.error("Error adding book:", error);
                if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.data);
                } else {
                    setErrorMessage("An error occurred while adding the book.");
                }
            });
    };

    const handleCancel = () => {
        navigate("/voting");
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <h2 id="addBookTitle" className="text-center mb-4">Add a New Book</h2>
                    <div id="addBookCard" className="card shadow-sm">
                        <div className="card-body">
                            {errorMessage && (
                                <div className="alert alert-danger text-center" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="form-control"
                                        placeholder="Enter the book title"
                                        value={newBook.title}
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
                                        placeholder="Enter the author's name"
                                        value={newBook.author}
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
                                        placeholder="Enter a brief description of the book"
                                        value={newBook.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button id="submit-button" type="submit" className="btn btn-primary">
                                        <i className="bi bi-check-circle me-2"></i>Submit
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

export default AddBook;
