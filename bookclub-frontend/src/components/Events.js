import React, { useState, useEffect } from "react";
import { request } from "../axios_helper";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Events.css';
import './Button.css';


const Events = () => {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            request("GET", "/users/me")
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                });
        }

        request("GET", "/api/events")
            .then((response) => {
                const sortedEvents = response.data.sort((a, b) => b.id - a.id);
                setEvents(sortedEvents);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    const handleEdit = (eventId) => {
        navigate(`/edit-event/${eventId}`);
    };

    const handleDelete = (eventId) => {
        request("DELETE", `/api/events/${eventId}`)
            .then(() => {
                setEvents(events.filter((event) => event.id !== eventId));
            })
            .catch((error) => {
                console.error("Error deleting event:", error);
            });
    };

    const handleAddEvent = () => {
        navigate("/addevent");
    };

    return (
        <div className="container-fluid">
            <h2 id="eventTitle" className="text-center">Event Announcements</h2>

            <div className="event-cards">
                {events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id} className="custom-card">
                            <Card.Body>
                                <Card.Title style={{color: '#382110', fontWeight: 'bold', fontSize: '28px'}}>{event.title}</Card.Title>
                                <Card.Text>
                                    {event.content}
                                </Card.Text>
                                {user?.role === "ADMIN" && (
                                    <div className="float-end">
                                        <button id="editButton"
                                            className="btn btn-light me-2"
                                            onClick={() => handleEdit(event.id)}
                                            title="Edit"
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button id="deleteButton"
                                            className="btn btn-light text-danger"
                                            onClick={() => handleDelete(event.id)}
                                            title="Delete"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No events available.</p>
                    </div>
                )}
            </div>

            {user?.role === "ADMIN" && (
                <button
                    id="add-button"
                    className="btn btn-lg btn-primary add-button"
                    style={{ position: "fixed", bottom: "20px", right: "20px" }}
                    onClick={handleAddEvent}
                >
                    +
                </button>
            )}
        </div>
    );
};

export default Events;
