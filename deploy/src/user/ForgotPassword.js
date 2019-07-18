import React, { Component } from 'react';
import { forgotPassword } from '../auth';


class ForgotPassword extends Component {

	state = {
		email: "",
		message: "",
		error: ""
	};

	forgotPassword = e => {
		e.preventDefault();
		this.setState({ message: "", error: " " });
		forgotPassword(this.state.email).then(data => {
			if (data.error) {
				console.log(data.error);
				this.setState({ error: data.error });
			} else {
				console.log(data.message);
				this.setState({ message: data.message });
			}
		});
	};

	render() {
		return (
			<div className="container ResetPassword pt-5">
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">Password Reset</h2>
						{this.state.message && (
							<h6 className="text-success mb-5">{this.state.message}</h6>
						)}
						{this.state.error && (
							<h6 className="alert alert-warning">{this.state.error}</h6>
						)}
						<form id="formDIV mt-5">
							<div className="form-group">
								<input onChange={e => this.setState({
									email: e.target.value,
									message: "",
									error: ""
								})} type="email" className="form-control" value={this.state.email} name="email" placeholder="Enter Your Email" autoFocus />
							</div>
							<button onClick={this.forgotPassword} className="btn btn-raised mr-5"> <i className="fa fa-send"></i> Send Password Reset Link </button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default ForgotPassword;