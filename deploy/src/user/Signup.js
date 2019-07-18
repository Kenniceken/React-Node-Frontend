import React, { Component } from 'react';
import { signup } from '../auth';
import { Link } from 'react-router-dom';

class Signup extends Component {

	constructor() {
		super();
		this.state = {
			name: "",
			email: "",
			password: "",
			error: "",
			open: false,
			recaptcha: false
		};
	}

	handleChange = name => event => {
		this.setState({ error: "" })
		this.setState({ [name]: event.target.value });
	};


	recaptchaHandler = e => {
		this.setState({ error: "" });
		let userDay = e.target.value.toLowerCase();
		let dayCount;

		if (userDay === "sunday") {
			dayCount = 0;
		} else if (userDay === "monday") {
			dayCount = 1;
		} else if (userDay === "tuesday") {
			dayCount = 2;
		} else if (userDay === "wednesday") {
			dayCount = 3;
		} else if (userDay === "thursday") {
			dayCount = 4;
		} else if (userDay === "friday") {
			dayCount = 5;
		} else if (userDay === "saturday") {
			dayCount = 6;
		}

		if (dayCount === new Date().getDay()) {
			this.setState({ recaptcha: true });
			return true;
		} else {
			this.setState({
				recaptcha: false
			});
			return false;
		}
	};





	clickSubmit = event => {
		event.preventDefault();
		const { name, email, password } = this.state;
		const user = {
				name,
				email,
				password
		};
		// console.log(user);
		if (this.state.recaptcha) {
			signup(user).then(data => {
				if (data.error) this.setState({ error: data.error });
				else
					this.setState({
						error: "",
						name: "",
						email: "",
						password: "",
						open: true
					});
			});
		} else {
			this.setState({
				error: "What day is today? Please fill in the Correct Day!"
			});
		}
	};


	signupForm = (name, email, password, recaptcha) => (
		<form id="formDIV">
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("name")} type="text" className="form-control" value={name} placeholder="Enter Your Name" />
			</div>
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("email")} type="email" className="form-control" value={email} placeholder="Enter Your Email" />
			</div>
			
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("password")} type="password" className="form-control" value={password} placeholder="Enter Your Password" />
			</div>
			<div className="form-group">
				<label className="text-muted">{recaptcha ? "That is Correct!" : "What day is today?"}</label>
				<input onChange={this.recaptchaHandler} type="text" className="form-control" />
			</div>
			
			<button onClick={this.clickSubmit} className="btn btn-raised"><i className="fa fa-user-plus"></i> Signup</button>

			<div className="text-muted pt-3">
				<p style={{ fontFamily: "trebuchet" }}>Already have an Account Yet?, <Link to="/signin"> Login</Link></p>
			</div>
		</form>

	);


	render() {
		const { name, email, password, error, open, recaptcha } = this.state;
		return (
			<div className="container">
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">Signup</h2>

						<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
							<p style={{ fontFamily: "trebuchet" }}>{error}</p>
						</div>

						<div className="alert alert-success" style={{ display: open ? "" : "none" }}>
							<p style={{ fontFamily: "trebuchet" }}>Your Profile has been Successfully Created, Please <Link to="/signin"> Login </Link> to View Your Profile !!!</p>
						</div>

						{this.signupForm(name, email, password, recaptcha)}						
					</div>
				</div>
			</div>
		);
	}
};


export default Signup;