import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate } from '../auth';
import SocialLogin from './SocialLogin';

class Signin extends Component {

	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			error: "",
			redirectToReferer: false,
			loading: false
		};
	}

	handleChange = name => event => {
		this.setState({ error: "" })
		this.setState({ [name]: event.target.value });
	};

	

	clickSubmit = event => {

		event.preventDefault();
		this.setState({loading: true})

		const { email, password } = this.state;
		const user = {
			email,
			password
		};
		console.log(user);
		signin(user).then(data => {
			if (data.error) {
				this.setState({ error: data.error, loading: false });
			} else {
				// authenticate the user & Redirect
				authenticate(data, () => {
					this.setState({redirectToReferer: true})
				});
			}
		});
	};



	signinForm = (email, password) => (
		<form id="formDIV">
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("email")} type="email" className="form-control" value={email} placeholder="Enter Your Email" />
			</div>
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("password")} type="password" className="form-control" value={password} placeholder="Enter Your Password" />
			</div>
			<button onClick={this.clickSubmit} className="btn btn-raised mr-5"> <i className="fa fa-sign-in"></i> Login</button>  <span style={{ fontFamily: "trebuchet" }}>
				<Link to="/forgot-password"> Forgot Password? </Link>
			</span>
			<div className="text-muted pt-3">				
				<p style={{ fontFamily: "trebuchet" }}>
				Don't have an Account Yet?,
					<Link to="/signup"> Register</Link>
				</p>
				<hr />
				<SocialLogin />
			</div>				
		</form>
	);


	render() {
		const { email, password, error, redirectToReferer, loading } = this.state;

		if (redirectToReferer) {
			return <Redirect to="/" />
		}


		return (
			<div className="container">
				<div className="row justify-content-md-center">
					<div className="col-md-4 col-offset-md-8">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">Login Form</h2>

						<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
							<p style={{ fontFamily: "trebuchet" }}>{error}</p>
						</div>

						{ loading ? <div className="jumbotron text-center" id="preloader">
								<div id="loader"></div>
							</div> : ""	}

						{this.signinForm(email, password)}						
					</div>
				</div>
			</div>
		);
	}
};


export default Signin;