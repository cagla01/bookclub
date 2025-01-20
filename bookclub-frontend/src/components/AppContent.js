import * as React from 'react';

import { request, setAuthHeader } from '../axios_helper';

import LoginForm from './LoginForm';
import AuthContent from './AuthContent';

import './AppContent.css';

export default class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome",
            isLoggedIn: false,
        };
    }

    login = () => {
        this.setState({ componentToShow: "login" });
    };

    logout = () => {
        localStorage.removeItem("token");
        this.setState({ componentToShow: "welcome", isLoggedIn: false });
        setAuthHeader(null);
    };

    onLogin = (e, email, password) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Email and password cannot be empty!");
            return;
        }

        request("POST", "/auth/login", {
            email: email,
            password: password,
        })
            .then((response) => {

                localStorage.setItem("token", response.data.token);

                setAuthHeader(response.data.token);
                this.setState({ componentToShow: "messages", isLoggedIn: true });
            })
            .catch((error) => {
                setAuthHeader(null);
                this.setState({ componentToShow: "welcome", isLoggedIn: false });
            });
    };

    onRegister = (event, fullName, email, password) => {
        event.preventDefault();

        if (!email || !password || !fullName) {
            alert("Email, password and name cannot be empty!");
            return;
        }

        request("POST", "/auth/signup", {
            fullName: fullName,
            email: email,
            password: password,
        })
            .then((response) => {
                setAuthHeader(response.data.token);
                this.setState({ componentToShow: "messages", isLoggedIn: true });
            })
            .catch((error) => {
                setAuthHeader(null);
                this.setState({ componentToShow: "welcome", isLoggedIn: false });
            });
    };

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthHeader(token);
            this.setState({ isLoggedIn: true, componentToShow: "messages" });
        }
    }


    render() {
        return (
            <>
                {this.state.componentToShow === "login" && (
                    <LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />
                )}
                {this.state.componentToShow === "messages" && <AuthContent />}
            </>
        );
    }
}
