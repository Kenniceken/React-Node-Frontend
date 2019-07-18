import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { remove } from './apiPost';

class DeletePost extends Component {

	state = {
		redirectToHome: false
	}

	deletePost = () => {
		const postId = this.props.postId;
		const token = isAuthenticated().token;
		remove(postId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ redirectToHome: true });
			}
		});
	};

	confirmDelete = () => {
		let answer = window.confirm(
			"Are You Sure you wish to Delete This Post?"
			);
			if (answer) {
				this.deletePost();
			}
	};

	render() {
		if (this.state.redirectToHome) {
			return <Redirect to={`/`} />;
		}
		return (
			<button onClick={this.confirmDelete} className="btn btn-sm btn-outline-danger btn-raised delBTN" data-toggle="tooltip" data-placement="right" title="Delete Post">
				<i className="fa fa-trash"></i>
			</button>
		);
	}
}


export default DeletePost;