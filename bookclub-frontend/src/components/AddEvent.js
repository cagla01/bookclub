import React, { useState } from 'react';
import { request } from '../axios_helper';
import { useNavigate } from 'react-router-dom';
import './AddEvent.css';

const AddEvent = () => {
    const [newEvent, setNewEvent] = useState({ title: '', content: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newEvent.title || !newEvent.content) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        request("POST", "/api/events", newEvent)
            .then((response) => {
                navigate("/events");
            })
            .catch((error) => {
                console.error("Error adding event:", error);
                if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.data);
                } else {
                    setErrorMessage("An error occurred while adding the event.");
                }
            });
    };

    const handleCancel = () => {
        navigate("/events");
    };

    return (
        <div className="container mt-4">
            <h2 id="addEventTitle" className="text-center mb-4">Add a New Event</h2>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <div className="row justify-content-center">
                <div id="addEventCard" className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={newEvent.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    className="form-control"
                                    rows="4"
                                    value={newEvent.content}
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

export default AddEvent;
