import React, { useState, useEffect } from 'react';
import { request } from '../axios_helper';
import { useParams, useNavigate } from 'react-router-dom';
import './EditEvent.css';

const EditEvent = () => {
    const [event, setEvent] = useState(null);
    const [updatedEvent, setUpdatedEvent] = useState({ title: '', content: '' });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        request("GET", `/api/events/${id}`)
            .then((response) => {
                setEvent(response.data);
                setUpdatedEvent({
                    title: response.data.title,
                    content: response.data.content,
                });
            })
            .catch((error) => {
                console.error("Error fetching event:", error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent({ ...updatedEvent, [name]: value });
    };

    const handleEditEvent = (e) => {
        e.preventDefault();

        if (!updatedEvent.title || !updatedEvent.content) {
            alert("Please fill in all fields.");
            return;
        }

        request("PUT", `/api/events/${id}`, updatedEvent)
            .then(() => {
                navigate('/events');
            })
            .catch((error) => {
                console.error("Error editing event:", error);
            });
    };

    const handleCancel = () => {
        navigate("/events");
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 id="editEventTitle" className="text-center mb-4">Edit Event</h2>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div id="editEventCard" className="card shadow-sm">
                        <div className="card-body">
                            <form onSubmit={handleEditEvent}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="form-control"
                                        value={updatedEvent.title}
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
                                        value={updatedEvent.content}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button id="submit-button" type="submit" className="btn btn-primary">
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
        </div>
    );
};

export default EditEvent;
