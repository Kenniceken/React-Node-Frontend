import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";



class SocialLogin extends Component {
	constructor() {
		super();
		this.state = {
			redirectToReferrer: false
		};
	}

	responseGoogle = response => {
		console.log(response);
		const { googleId, name, email, imageUrl } = response.profileObj;
		const user = {
			password: googleId,
			name: name,
			email: email,
			imageUrl: imageUrl
		};

		// console.log("user obj to social login: ", user);
		socialLogin(user).then(data => {
			console.log("signin data: ", data);
			if (data.error) {
				console.log("Something went wrong. Please try again Later!!..");
			} else {
				console.log("signin success - setting jwt: ", data);
				authenticate(data, () => {
					this.setState({ redirectToReferrer: true });
				});
			}
		});
	};


	responseGoogle = (response) => {
		console.log(response);
		const { googleId, name, email, imageUrl } = response.profileObj;
		const user = {
			password: googleId,
			name: name,
			email: email,
			imageUrl: imageUrl
		};
		// console.log("user obj to social login: ", user);
		socialLogin(user).then(data => {
			console.log("signin data: ", data);
			if (data.error) {
				console.log("Error Login. Please try again..");
			} else {
				console.log("signin success - setting jwt: ", data);
				authenticate(data, () => {
					this.setState({ redirectToReferrer: true });
				});
			}
		});
	};




	render() {
		//redirect
		const { redirectToReferrer } = this.state;
		if (redirectToReferrer) {
			return <Redirect to="/" />;
		}

		return (

			<div className="container">
				<div className="row">
					<div className="col-md-12 float-left">
						<GoogleLogin
							clientId="816153809520-cgkoi9hpghta0i0hot6uj9lp98nu2fjn.apps.googleusercontent.com"
							buttonText="Login with Gmail"
							onSuccess={this.responseGoogle}
							onFailure={this.responseGoogle}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default SocialLogin;