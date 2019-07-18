import React, { Component } from 'react';
import Posts from '../post/Posts';
import Users from '../user/Users';
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";

class Admin extends Component {

	state = {
		redirectToHome: false
	};

	componentDidMount() {
		if (isAuthenticated().user.role !== "admin" && isAuthenticated().user.role !== "superadmin") {
			this.setState({ redirectToHome: true });
		}

	}

	render() {
		if (this.state.redirectToHome) {
			return <Redirect to="/" />;
		}
		return (

			<>
				<div className="jumbotron">
					<h2>Admin Home</h2>
					<p className="text-muted mt-3">Welcome to Admin Frontend</p>
				</div>

				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<hr />
							<Posts />
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<hr />
							<Users />
						</div>
					</div>
				</div>
			</>
		);
	}
};

export default Admin;