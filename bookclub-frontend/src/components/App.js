import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Voting from "./Voting";
import Discussion from "./Discussion";
import Events from "./Events";
import EditBook from "./EditBook";
import LoginForm from "./LoginForm";
import AuthContent from "./AuthContent";
import { request, setAuthHeader } from "../axios_helper";
import AddBook from "./AddBook";
import Thread from "./Thread";
import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";
import { Base64 } from "js-base64";
import UserManagement from "./UserManagement";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthHeader(token);
            setIsLoggedIn(true);
            request("GET", "/users/me")
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                });
        }else {
            setIsLoggedIn(false);
        }
    }, []);

    const onLogin = (e, email, password) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Email and password cannot be empty!");
            return;
        }

        const credentials = Base64.encode(`${email}:${password}`);

        request("GET", "/auth/login", null, {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                setAuthHeader(response.data.token);
                setIsLoggedIn(true);

                return request("GET", "/users/me");
            })
            .then((response) => {
                setUser(response.data);
            })
            .catch(() => {
                alert("Login failed, please try again.");
            });
    };



    const onRegister = (event, fullName, email, password) => {
        event.preventDefault();

        if (!email || !password || !fullName) {
            alert("Email, password, and name cannot be empty!");
            return;
        }

        request("POST", "/auth/signup", { fullName, email, password })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                setAuthHeader(response.data.token);
                setIsLoggedIn(true);
            })
            .catch(() => {
                alert("Registration failed, please try again.");
            });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setAuthHeader(null);
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} logout={logout} user={user} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    isLoggedIn ? (
                                        <AuthContent />
                                    ) : (
                                        <div>
                                            Welcome to Our Digital Book Club! 📚 <br/>
                                            <br/>
                                            We're so glad you're here! Join our vibrant community of readers where you can recommend your favorite books,
                                            vote on what to read next, and dive into lively discussions about the books that shape our reading journey.
                                            Ready to embark on your next literary adventure?
                                            <br/>Sign up or log in to start participating today!
                                        </div>
                                    )
                                }
                            />
                            <Route path="/voting/:bookId?" element={<Voting />} />
                            <Route path="/discussion" element={<Discussion />} />
                            <Route path="/discussion/:discussionId" element={<Thread />} />
                            <Route
                                path="/events"
                                element={
                                    isLoggedIn ? <Events /> : <Navigate to="/unauthorized" replace />
                                }
                            />
                            <Route
                                path="/addbook"
                                element={
                                    isLoggedIn ? <AddBook /> : <Navigate to="/unauthorized" replace />
                                }
                            />
                            <Route
                                path="/edit-book/:bookId"
                                element={
                                    isLoggedIn ? <EditBook /> : <Navigate to="/unauthorized" replace />
                                }
                            />
                            <Route
                                path="/addevent"
                                element={
                                    isLoggedIn ? <AddEvent /> : <Navigate to="/unauthorized" replace />
                                }
                            />
                            <Route
                                path="/edit-event/:id"
                                element={
                                    isLoggedIn ? <EditEvent /> : <Navigate to="/unauthorized" replace />
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    isLoggedIn && user?.role === "ADMIN" ? (
                                        <UserManagement />
                                    ) : (
                                        <Navigate to="/unauthorized" replace />
                                    )
                                }
                            />

                            <Route
                                path="/login"
                                element={
                                    !isLoggedIn ? (
                                        <LoginForm
                                            onLogin={onLogin}
                                            onRegister={onRegister}
                                        />
                                    ) : (
                                        <AuthContent />
                                    )
                                }
                            />
                            <Route
                                path="/unauthorized"
                                element={<div>You are not authorized to view this page.</div>}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
