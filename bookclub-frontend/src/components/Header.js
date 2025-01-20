import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import './Header.css';

export default function Header({ isLoggedIn, logout, user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Navbar expand="lg" className="App-header" collapseOnSelect>
            <Container>
                <Navbar.Brand onClick={() => navigate("/")} className="App-title">
                    Bookclub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            className={`Nav-Klass ${isActive("/discussion") ? "Nav-Active" : ""}`}
                            onClick={() => navigate("/discussion")}
                        >
                            Discussion
                        </Nav.Link>
                        <Nav.Link
                            className={`Nav-Klass ${isActive("/voting") ? "Nav-Active" : ""}`}
                            onClick={() => navigate("/voting")}
                        >
                            Voting
                        </Nav.Link>
                        {isLoggedIn && (
                            <Nav.Link
                                className={`Nav-Klass ${isActive("/events") ? "Nav-Active" : ""}`}
                                onClick={() => navigate("/events")}
                            >
                                Events
                            </Nav.Link>
                        )}
                        {isLoggedIn && user?.role === "ADMIN" && (
                            <Nav.Link
                                className={`Nav-Klass ${isActive("/admin/users") ? "Nav-Active" : ""}`}
                                onClick={() => navigate("/admin/users")}
                            >
                                User Management
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <Nav.Link
                                className="Nav-Klass"
                                onClick={handleLogout}
                            >
                                Logout
                            </Nav.Link>
                        ) : (
                            <button onClick={() => navigate("/login")} id="login-button" className="Header-Button">
                                Login
                            </button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
