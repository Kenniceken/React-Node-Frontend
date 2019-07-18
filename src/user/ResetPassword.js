import React, { Component } from "react";
import { resetPassword } from "../auth";

class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newPassword: "",
			message: "",
			error: ""
		};
	}

	resetPassword = e => {
		e.preventDefault();
		this.setState({ message: "", error: "" });

		resetPassword({
			newPassword: this.state.newPassword,
			resetPasswordLink: this.props.match.params.resetPasswordToken
		}).then(data => {
			if (data.error) {
				console.log(data.error);
				this.setState({ error: data.error });
			} else {
				console.log(data.message);
				this.setState({ message: data.message, newPassword: "" });
			}
		});
	};

	render() {

		return (
			<div className="container ResetPassword pt-5">
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">Reset Your Password </h2>
						{this.state.message && (
							<h6 className="alert alert-success">{this.state.message}</h6>
						)}
						{this.state.error && (
							<h6 className="alert alert-warning">{this.state.error}</h6>
						)}
						<form id="formDIV mt-5">
							<div className="form-group">
								<input onChange={e =>
									this.setState({
										newPassword: e.target.value,
										message: "",
										error: ""
									})
								} type="password" className="form-control" value={this.state.newPassword} name="newPassword" placeholder="Enter Your New Password" autoFocus />
							</div>
							<button onClick={this.resetPassword} className="btn btn-raised mr-5"> <i className="fa fa-send"></i> Reset Password </button>
						</form>
					</div>
				</div>
			</div>
		);
	}

}

export default ResetPassword;