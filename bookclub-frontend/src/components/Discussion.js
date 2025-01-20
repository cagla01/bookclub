import React, { useEffect, useState } from 'react';
import { request } from '../axios_helper';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Discussion.css';

const Discussion = () => {
    const [discussions, setDiscussions] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            request("GET", "/users/me")
                .then((response) => setUser(response.data))
                .catch((error) => console.error("Error fetching user details:", error));
        }
    }, []);

    useEffect(() => {
        request("GET", "/api/discussions")
            .then((response) => {
                const sortedDiscussion = response.data.sort((a, b) => b.id - a.id);
                setDiscussions(sortedDiscussion);
            })
            .catch((error) => console.error("Error fetching discussions:", error));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2 id="discussionTitle" className="text-center">Discussion Boards</h2>
            {discussions.length === 0 ? (
                <p>No discussions available.</p>
            ) : (
                discussions.map((discussion) => (
                    <Card key={discussion.id} className="discussion-card shadow">
                        <Card.Body>
                            <div className="d-flex">
                                <img
                                    src={discussion.bookImageUrl}
                                    alt={discussion.bookTitle}
                                    className="discussion-image"
                                    onError={(e) => (e.target.src = "/images/default-book-cover.jpg")}
                                />
                                <div className="discussion-details">
                                    <Card.Title>{discussion.bookTitle}</Card.Title>
                                    <Card.Subtitle className="text-muted mb-3">{discussion.bookAuthor}</Card.Subtitle>
                                    <Card.Text>
                                        {discussion.bookDescription.length > 300
                                            ? `${discussion.bookDescription.slice(0, 100)}...`
                                            : discussion.bookDescription}
                                    </Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer id="discussionCardFooter" className="bg-light d-flex justify-content-end">
                            {user && (
                                <Button id="thread-button"
                                    onClick={() => (window.location.href = `/discussion/${discussion.id}`)}
                                >
                                    See Thread
                                </Button>
                            )}
                        </Card.Footer>
                    </Card>
                ))
            )}
        </div>
    );
};

export default Discussion;
