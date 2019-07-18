import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { remove } from './apiUser';
import { signout } from '../auth';

class DeleteUser extends Component {

	state = {
		redirect: false
	}

	deleteAccount = () => {
		const token = isAuthenticated().token;
		const userId = this.props.userId;
		remove(userId, token)
		.then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				// signput user and redicrect
				signout(() => console.log("Your Profile has been Deleted!!!"));
				//redirect
				this.setState({ redirect: true });
			}
		});
	};

	confirmDelete = () => {
		let answer = window.confirm(
			"Are You Sure you wish to Delete Your Account?"
			);
			if (answer) {
				this.deleteAccount();
			}
	};

	render() {
		if (this.state.redirect) {
			return <Redirect to="/" />;
		}
		return (

			<button onClick={this.confirmDelete} className="btn btn-raised btn-outline-danger btn-block"> 
				Delete Profile
			</button>
		);
	}
}


export default DeleteUser;