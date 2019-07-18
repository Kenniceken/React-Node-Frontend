import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../assets/default.png';



class Comment extends Component {

	state = {
		text: "",
		error: ""
	};

	handleChange = event => {
		this.setState({ error: "" });
		this.setState({ text: event.target.value });
	};

	isValid = () => {
		const { text } = this.state;
		if (!text.length > 0 || text.length > 200) {
			this.setState({ error: "Comments should not be empty or more thant 250 characters!!!.." });
			return false;
		}
		return true;
	}



	addComment = e => {
		e.preventDefault();

		if (!isAuthenticated()) {
			this.setState({ error: "Please Login before you can Leave a Comment!!!..." });
			return false;
		}
		
		if (this.isValid()) {

			const userId = isAuthenticated().user._id;
			const token = isAuthenticated().token;
			const postId = this.props.postId;

			comment(userId, token, postId, { text: this.state.text }).then(data => {
				if (data.error) {
					console.log(data.error);
				} else {
					this.setState({ text: "" });
					// Send newly created list of comments to the parent Component (SinglePost)
					this.props.updateComments(data.comments);

				}
			});
		}

	};



	deleteComment = (comment) => {

		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const postId = this.props.postId;

		uncomment(userId, token, postId, comment).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				// Send newly created list of comments to the parent Component (SinglePost)
				this.props.updateComments(data.comments);

			}
		});
	};

	confirmDelete = (comment) => {
		let answer = window.confirm(
			"Are You Sure you wish to Remove This Comment?"
		);
		if (answer) {
			this.deleteComment(comment);
		}
	};

	render() {
		const { comments } = this.props;
		const { error } = this.state;

		return (
				
		<>
			<div className="row">
				<div className="col-md-10 col-offset-md-2">
					<h6 className="text-info" id="loginFormTitle">Leave a Comment</h6>

					<form onSubmit={this.addComment} id="formDIVComments">
						<div className="form-group">
							<textarea className="form-control textAreaEdit" rows="2" onChange={this.handleChange} value={this.state.text}>
							</textarea>
						</div>
						<button className="btn btn-raised"> <i className="fa fa-send"></i> Post Comment</button>
					</form>
					<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
						<p style={{ fontFamily: "trebuchet", fontSize: "16px" }}>{error}</p>
					</div>
				</div>					
			</div>
			<div className="row commentsDivRow">
				<div className="col-md-10 col-offset-md-2 col-xs-6 col-md-auto justify-content-md-center followingDiv">
					<div className="row  justify-content-md-center">
						<div className="col-md-12 col-xl-12 col-xs-12 mx-auto userFollowDiv">
							<h6 className="text-info" id="loginFormTitle">
								{comments.length} Comments <i className="fa fa-comments"></i>
							</h6>
							<hr />
							{comments.map((comment, i) => 
								<div key={i}>
									<div className="row">
										<div className="col-md-12">
											<Link to={`/user/${comment.postedBy._id}`} className="mb-3">
												<img
													className="pull-left mr-3 mb-3"
													style={{ height: "30px", borderRadius: "50%", width: "30px", border: "1px solid rgba(54,54,54,0.63)" }}
													onError={i => (i.target.src = `${DefaultAvatar}`)}
													src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`} alt={comment.postedBy.name} 
												/> 
											</Link>
											<div className="commentsS">											
												<p className="commentsSection">{comment.text}</p>
												<p className="font-italic posterNameText">
													Posted By <Link to={`/user/${comment.postedBy._id}`} className="posterNameLink">{comment.postedBy.name}{" "}</Link>
													{" "} on {new Date(comment.created).toDateString()}	
													&nbsp;
													<span>
														{isAuthenticated().user &&
															isAuthenticated().user._id === comment.postedBy._id && (
															<button
																onClick={() => this.confirmDelete(comment)
																}
																className="btn btn-sm btn-outline-danger btn-raised delBTN">
																<i className="fa fa-times"></i>
															</button>
															)}
													</span>	
												</p>	
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>

		);
	}
}

export default Comment;