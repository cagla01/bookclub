import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../axios_helper";
import { Button, Spinner, Modal, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBContainer,
    MDBTypography,
} from "mdb-react-ui-kit";
import "./Thread.css";
import './Button.css';

function Thread() {
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        request("GET", "/users/me")
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });

        request("GET", `/api/discussions/${discussionId}`)
            .then((response) => {
                setDiscussion(response.data);
                setComments(response.data.comments.reverse());
            })
            .catch((error) => console.error("Error fetching discussion:", error));
    }, [discussionId]);

    const addComment = () => {
        if (!newComment.trim()) {
            alert("Comment cannot be empty!");
            return;
        }

        request("POST", `/api/discussions/${discussionId}/comments`, newComment)
            .then((response) => {
                setComments([response.data, ...comments]);
                setNewComment("");
                setShowModal(false);
            })
            .catch((error) => console.error("Error adding comment:", error));
    };

    const startEditing = (comment) => {
        setEditingComment(comment.id);
        setEditedContent(comment.content.replace(/^"|"$/g, ""));
    };

    const saveEdit = (commentId) => {
        request("PUT", `/api/discussions/comments/${commentId}`, { content: editedContent })
            .then(() => {
                setComments(
                    comments.map((comment) =>
                        comment.id === commentId ? { ...comment, content: editedContent } : comment
                    )
                );
                setEditingComment(null);
            })
            .catch((error) => console.error("Error saving comment:", error));
    };

    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            request("DELETE", `/api/discussions/comments/${commentId}`)
                .then(() => {
                    setComments(comments.filter((comment) => comment.id !== commentId));
                })
                .catch((error) => console.error("Error deleting comment:", error));
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    if (!comments) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            {discussion ? (
                <>
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
                                    <Card.Subtitle className="text-muted mb-3">
                                        {discussion.bookAuthor}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        {discussion.bookDescription.length > 300
                                            ? `${discussion.bookDescription.slice(0, 100)}...`
                                            : discussion.bookDescription}
                                    </Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <MDBContainer
                        className="py-5"
                        style={{
                            maxWidth: "90%",
                            margin: "0 auto",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            padding: "20px",
                        }}
                    >
                        <MDBTypography id="commentTitle" tag="h4" className="text-center mb-4">
                            Comments Section
                        </MDBTypography>

                        {comments.map((comment) => (
                            <MDBCard key={comment.id} className="mb-3 mx-auto" style={{ maxWidth: "90%" }}>
                                <MDBCardBody className="d-flex flex-start" style={{ backgroundColor: "#F5F2EA" }}>
                                    <MDBCardImage
                                        className="rounded-circle shadow-1-strong me-3"
                                        src="/images/default-avatar.png"
                                        alt="User avatar"
                                        width="50"
                                        height="50"
                                    />
                                    <div className="w-100">
                                        <MDBTypography tag="h6" className="fw-bold mb-1">
                                            {comment.firstName}
                                        </MDBTypography>
                                        <div className="d-flex align-items-center mb-2">
                                            <p className="mb-0 me-2 text-muted">{comment.date}</p>
                                        </div>

                                        {editingComment === comment.id ? (
                                            <div>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                rows="2"
                                className="form-control mb-2"
                            />
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => saveEdit(comment.id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => setEditingComment(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="mb-3">{comment.content.replace(/^"|"$/g, "")}</p>
                                        )}

                                        {(comment.username === user.username || user?.role === "ADMIN") &&
                                            editingComment !== comment.id && (
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button id="editButton"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => startEditing(comment)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button id="deleteButton"
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => deleteComment(comment.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        ))}

                        {comments.length === 0 && (
                            <p className="text-center text-muted">Be the first to comment!</p>
                        )}

                        <div className="text-center">
                            <Button onClick={handleShowModal}
                                    className="btn-lg postComment"
                                    style={{ position: 'fixed', bottom: '30px', right: '30px' }}>
                                Add Comment
                            </Button>
                        </div>
                    </MDBContainer>

                    <Modal show={showModal} onHide={handleCloseModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add a New Comment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="newComment">
                                    <Form.Label>Your Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                onClick={addComment}>
                                Post Comment
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <p>Loading discussion...</p>
            )}
        </div>
    );
}

export default Thread;
