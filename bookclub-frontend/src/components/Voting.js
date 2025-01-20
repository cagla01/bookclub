import React, { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { format } from 'date-fns';
import './Voting.css';
import './Button.css';

const Voting = () => {
    const [books, setBooks] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [userVote, setUserVote] = useState(null);
    const [globalDeadline, setGlobalDeadline] = useState(null);
    const [newDeadline, setNewDeadline] = useState('');
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            request("GET", "/users/me")
                .then((response) => setUser(response.data))
                .catch((error) => console.error("Error fetching user details:", error));

            request("GET", "/api/books/global-deadline")
                .then((response) => setGlobalDeadline(response.data))
                .catch((error) => console.error("Error fetching global deadline:", error));

            request("GET", "/votes/user")
                .then((response) => setUserVote(response.data?.id))
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        setUserVote(null);
                    } else {
                        console.error("Error fetching user vote:", error);
                    }
                });
        }

        request("GET", "/api/books/available")
            .then((response) => setBooks(response.data))
            .catch((error) => console.error("Error fetching books:", error));
    }, []);

    useEffect(() => {
        if (globalDeadline) {
            const interval = setInterval(() => {
                const now = new Date();
                const deadlineDate = new Date(globalDeadline);
                const diff = deadlineDate - now;

                if (diff <= 0) {
                    clearInterval(interval);
                    setTimeRemaining('The voting deadline has passed.');
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    const seconds = Math.floor((diff / 1000) % 60);

                    setTimeRemaining(
                        `${days}d ${hours}h ${minutes}m ${seconds}s remaining`
                    );
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [globalDeadline]);

    const handleSetDeadline = () => {
        if (newDeadline) {
            request("PATCH", "/api/books/admin/set-deadline", { deadline: newDeadline })
                .then(() => {
                    setGlobalDeadline(newDeadline);
                    alert("Deadline updated successfully.");
                })
                .catch((error) => console.error("Error setting deadline:", error));
        } else {
            alert("Please select a valid deadline.");
        }
    };

    const handleVote = (bookId) => {
        request("POST", `/votes/${bookId}`)
            .then(() => setUserVote(bookId))
            .catch((error) => console.error("Error casting vote:", error));
    };

    const handleEdit = (bookId) => navigate(`/edit-book/${bookId}`);
    const handleDelete = (bookId) => {
        request("DELETE", `/api/books/${bookId}`)
            .then(() => setBooks(books.filter((book) => book.id !== bookId)))
            .catch((error) => console.error("Error deleting book:", error));
    };

    return (
        <div className="container mt-4">
            <h2 id="votingTitle" className="text-center mb-4">Book Recommendations & Voting</h2>

            {globalDeadline ? (
                <>
                    <p>
                        <strong>Voting Deadline:</strong>{' '}
                        {format(new Date(globalDeadline), 'MMMM dd, yyyy, hh:mm a')}
                    </p>
                    <p>
                        <strong>Countdown:</strong>{' '}
                        <span style={{ color: 'red' }}>{timeRemaining}</span>
                    </p>
                </>
            ) : (
                <p>No deadline set.</p>
            )}

            {user?.role === "ADMIN" && (
                <div className="mb-3">
                    <div className="d-flex align-items-center">
                        <input
                            type="datetime-local"
                            className="form-control me-2"
                            style={{ width: '200px' }}
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                        />
                        <Button id="deadlineButton" variant="warning" onClick={handleSetDeadline}>
                            Set Deadline
                        </Button>
                    </div>
                </div>
            )}

            <div className="row">
                {books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} className="col-md-6 col-lg-4 mb-4">
                            <Card id="voteCards" className="h-100 shadow">
                                <Card.Body>
                                    <div className="d-flex align-items-start">
                                        <img
                                            src={book.imageUrl}
                                            alt={book.title}
                                            className="me-3"
                                            style={{
                                                width: '100px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '5px',
                                            }}
                                            onError={(e) => (e.target.src = "/images/default-book-cover.jpg")}
                                        />
                                        <div>
                                            <Card.Title className="mb-2">{book.title}</Card.Title>
                                            <Card.Subtitle className="mb-3 text-muted">{book.author}</Card.Subtitle>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <Card.Text style={{ fontSize: '14px', color: '#555' }}>
                                            {book.description}
                                        </Card.Text>
                                    </div>
                                </Card.Body>
                                <Card.Footer id="voteCardFooter" className="bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        {user &&(
                                            <Button
                                                id="vote-button"
                                                className={userVote === book.id ? "your-vote-button" : "vote-button"}
                                                disabled={new Date() > new Date(globalDeadline)}
                                                onClick={() => handleVote(book.id)}
                                            >
                                                {userVote === book.id ? "Your Vote" : "Vote"}
                                            </Button>
                                        )}


                                        {user && (user.role === "ADMIN" || user.id === book.createdBy?.id) && (
                                            <div>
                                                <Button id="editButton"
                                                        variant="light"
                                                        className="me-2"
                                                        onClick={() => handleEdit(book.id)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Button>
                                                <Button id="deleteButton"
                                                        variant="danger"
                                                        onClick={() => handleDelete(book.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No books available.</p>
                    </div>
                )}
            </div>

            {user && (
                <Button id="add-button"
                    variant="primary"
                    className="btn-lg add-button"
                    style={{ position: 'fixed', bottom: '20px', right: '20px' }}
                    onClick={() => navigate('/addbook')}
                >
                    +
                </Button>
            )}
        </div>
    );
};

export default Voting;
