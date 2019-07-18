import React, { Component } from 'react';
import { singlePost, like, unlike } from './apiPost';
import DeletePost from './DeletePost';
import { isAuthenticated } from '../auth';
import DefaultPostPhoto from '../assets/post-default.jpg';
import { Link, Redirect } from 'react-router-dom';
import  Comment  from './Comment';


class SinglePost extends Component {

	state = {
		post: '',
		redirectToHome: false,
		redirectToSignin: false,
		like: false,
		likes: 0,
		comments: []
	};

	checkLike = (likes) => {
		const userId = isAuthenticated() && isAuthenticated().user._id;
		let match = likes.indexOf(userId) !== -1;
		return match;
	};

	componentDidMount = () => {
		const postId = this.props.match.params.postId;
		singlePost(postId).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ 
					post: data, 
					likes: data.likes.length, 
					like: this.checkLike(data.likes),
					comments: data.comments
				});
			}
		});
	};

	updateComments = comments => {
		this.setState({ comments });
	}

	likeToggle = () => {

		if (!isAuthenticated()) {
			this.setState({ redirectToSignin: true });
			return false;
		}

		let callApi = this.state.like ? unlike : like;
		const userId = isAuthenticated().user._id;
		const postId = this.state.post._id;
		const token = isAuthenticated().token;

		callApi(userId, token, postId).then(data => {
			if (data.error) {
				console.log(data.error);
			}
			else {
				this.setState({
					like: !this.state.like,
					likes: data.likes.length
				});
			}
		});
	};



	renderPost = (post) => {
		const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
		const posterName = post.postedBy ? post.postedBy.name : " Anonymous";

		const { like, likes } = this.state;
		
		return (
			<div className="card singlePostBody lead" style={{ height: "auto" }}>
				<div className="card-body">
					<img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`} alt={post.title}
						onError={i => i.target.src = `${DefaultPostPhoto}`}
						className="img-fluid mb-3 postImageDiv"
						style={{ height: "200", width: "100%", marginBottom: "20px", objectFit: "cover" }}
					/>
					<p className="card-text postBodyTexts">{post.body}{"..."}</p>
					<hr />
					<span className="float-right">
						{like ? (
							<h6 onClick={this.likeToggle} className="btn btn-sm btn-outline-danger btn-raised unlikeBTN mr-2" data-toggle="tooltip" data-placement="top" title="UnLike This Post">
								<i className="fa fa-thumbs-down"></i> UnLike {likes}
							</h6>

						) : (
							<h6 onClick={this.likeToggle} className="btn btn-sm btn-outline-primary btn-raised likeBTN mr-2" data-toggle="tooltip" data-placement="top" title="Like This Post">
								<i className="fa fa-thumbs-up"></i> Like {likes}
							</h6>
						)}
					</span>
					<p className="font-italic posterNameText">
						Posted By <Link to={`${posterId}`} className="posterNameLink">{posterName}{" "}</Link>
						{" "} on {new Date(post.created).toDateString()}
					</p>					
					<div className="row">
						<div className="f-flex btn-group">
							<Link to={`/`} className="btn btn-raised btn-sm btn-outline-secondary mr-5">
								Go Back
							</Link>
							{isAuthenticated().user &&
								isAuthenticated().user.role === "admin" && 
								<>
									<Link to={`/post/edit/${post._id}`} className="btn btn-sm btn-outline-success btn-raised editBTN mr-2" data-toggle="tooltip" data-placement="top" title="Update Post">
										<i className="fa fa-edit"></i>
									</Link>
									<DeletePost postId={post._id} />
								</>
							}
							{isAuthenticated().user &&
								isAuthenticated().user._id === post.postedBy._id && 
								<>
								<Link to={`/post/edit/${post._id}`} className="btn btn-sm btn-outline-success btn-raised editBTN mr-2" data-toggle="tooltip" data-placement="top" title="Update Post">
									<i className="fa fa-edit"></i>
								</Link>
								<DeletePost postId={post._id} />
								</>
							}							
						</div>
					</div>
				</div>
			</div>
			
		);
	}

	render() {
		
		const { post, redirectToHome, redirectToSignin, comments } = this.state;

		if (redirectToHome) {
			return <Redirect to={`/`} />;
		} else if (redirectToSignin) {

			return <Redirect to={`/signin`} />;
		}

		return (
			<div className="container pt-3">
				<div className="row justify-content-md-center">
					<div className="col-md-9 col-offset-md-3 mt-5 mb-2 display-2">
						<h4 className="mt-5 mb-5 text-info" id="singlePostTitle">{post.title}</h4>
						{!post ? (
							<div className="jumbotron text-center" id="preloader">
								<div id="loader"></div>
							</div>
						) : (							
							this.renderPost(post) 
						)}	

						<Comment 
							postId={post._id} 
							comments={comments.reverse()} 
							updateComments={this.updateComments} 
						/>					
					</div>
				</div>
			</div>
		);
	}
}

export default SinglePost;