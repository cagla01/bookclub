import * as React from 'react';
import classNames from 'classnames';
import './LoginForm.css';

export default class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: "login",
            fullName: "",
            email: "",
            password: "",
            onLogin: props.onLogin,
            onRegister: props.onRegister
        };
    };

    onChangeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name] : value});
    };

    onSubmitLogin = (e) => {
        e.preventDefault();

        const { email, password } = this.state;

        if (!email || !password) {
            alert("Email and password cannot be empty!");
            return;
        }
        this.state.onLogin(e, this.state.email, this.state.password);
    };

    onSubmitRegister = (e) => {

        const { email, password, fullName } = this.state;

        if (!email || !password || !fullName) {
            alert("Email, password and name cannot be empty!");
            return;
        }

        this.state.onRegister(e, this.state.fullName, this.state.email, this.state.password);
    };

    render() {
        return (
            <div className="row justify-content-center">
                <div id="loginform" className="col-4">
                    <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className={classNames("nav-link", this.state.active === "login" ? "active" : "")} id="tab-login"
                                    onClick={() => this.setState({active: "login"})}>Login</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={classNames("nav-link", this.state.active === "register" ? "active" : "")} id="tab-register"
                                    onClick={() => this.setState({active: "register"})}>Register</button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div className={classNames("tab-pane", "fade", this.state.active === "login" ? "show active" : "")} id="pills-login" >
                            <form onSubmit={this.onSubmitLogin}>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="email">email</label>
                                    <input type="login" id="email" name= "email" className="form-control" onChange={this.onChangeHandler}/>
                                </div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" name="password" className="form-control" onChange={this.onChangeHandler}/>
                                </div>

                                <button id="sign-button" type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

                            </form>
                        </div>
                        <div className={classNames("tab-pane", "fade", this.state.active === "register" ? "show active" : "")} id="pills-register" >
                            <form onSubmit={this.onSubmitRegister}>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="fullName">Your Name (Display Name)</label>
                                    <input type="text" id="fullName" name="fullName" className="form-control" onChange={this.onChangeHandler}/>
                                </div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="email">E-Mail</label>
                                    <input type="text" id="email" name="email" className="form-control" onChange={this.onChangeHandler}/>
                                </div>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="registerPassword">Password</label>
                                    <input type="password" id="registerPassword" name="password" className="form-control" onChange={this.onChangeHandler}/>
                                </div>

                                <button id="sign-button" type="submit" className="btn btn-primary btn-block mb-3">Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

}