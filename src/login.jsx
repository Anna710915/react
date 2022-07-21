import {
    Button,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import  React, { Component } from "react";
import "./login.css";
import {Navigate} from "react-router-dom";
import AppNavBar from "./app-nav-bar";
import Popup from "./Popup";


export default class Login extends React.Component{

    emptyItem = {
        username:'',
        password:''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            login: false,
            isError: false,
            errorMessage: '',
            isToastShown: false,
            serverErrorMessage: ''
        };
        this.selectorRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideToast = this.hideToast.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        let itemValue = {...this.state.item};
        itemValue[name] = value;
        this.setState({item : itemValue, login : false});
    }

    async handleSubmit(event){
        event.preventDefault();
        const {item} = this.state;
        let login = false;
        let message = '';
        try {
            await fetch('http://localhost:8080/certificates/login', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            }).then(response => response.json())
                .then(function (body) {
                    if (body.token === undefined) {
                        message = body.message;
                        return;
                    }
                    login = true;
                    localStorage.setItem("token", body.token);
                    localStorage.setItem("role", body.role);
                });
        }catch (error){
            this.setState({
                isToastShown: true,
                serverErrorMessage: error.message
            });
            this.selectorRef.current = setTimeout(this.hideToast, 5000);
        }

        login ? this.setState({login: login}) :
            this.setState({isError: true, errorMessage: message});
    }

    hideToast(){
        this.setState({ isToastShown: false});
    }

    render() {
        const item = this.state.item;
        const login = this.state.login;
        return login ? <Navigate to="/certificates"/> :(
            <div className="main">
            <AppNavBar />
                {this.state.isToastShown &&
                <Popup>
                    {this.state.serverErrorMessage}
                </Popup>}
            <div className="login-container">
                <div className="login">
                    <h2>Login</h2>
                    <Form className="form" onSubmit={this.handleSubmit}>
                        <FormGroup className="login-row">
                            <Label for="login">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="login"
                                placeholder="username"
                                value={item.username}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup className="login-row">
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                value={item.password}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <div className="error-block">
                        {this.state.isError &&
                            <p className="error-text">{this.state.errorMessage}</p>}
                        </div>
                        <div className="button-container">
                            <Button className="login-button">
                                Submit</Button>
                        </div>
                    </Form>
                </div>
            </div>
            </div>
        );
    }
}