import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultAvatar from '../assets/default.png';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';

class Profile extends Component {
	constructor() {
		super();
		this.state = {
			user: { following: [], followers: [] },
			redirectToSignin: false,
			following: false,
			error: "",
			posts: []
		};
	}

	// Check following Status
	checkFollowStatus = user => {
		const jwt = isAuthenticated();
		const match = user.followers.find(follower => {
			// one user will have many IDs (followers) and vice versa
			return follower._id === jwt.user._id;
		});
		return match;
	};

	onClickFollowButton = callApi => {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;

		callApi(userId, token, this.state.user._id).then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			}
			else {
				this.setState({ user: data, following: !this.state.following });
			}
		});
	};

	

	init = userId => {
		const token = isAuthenticated().token;
		read(userId, token).then(data => {
			if (data.error) {
				this.setState({ redirectToSignin: true });
			} else {
				let following = this.checkFollowStatus(data);
				this.setState({ user: data, following });
				this.loadPosts(data._id)
			}
		});
	};

	loadPosts = userId => {
		const token = isAuthenticated().token;
		listByUser(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			}

			else {
				this.setState({ posts: data });
			}
		});
	};

	componentDidMount() {
		const userId = this.props.match.params.userId;
		this.init(userId);
	};


	componentWillReceiveProps(props) {
		const userId = props.match.params.userId;
		this.init(userId);
	};



	render() {
		const { redirectToSignin, user, posts } = this.state;
		
		if (redirectToSignin) return <Redirect to="/signin" />;

		const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultAvatar;
		return (
			<div className="container-fluid profileBody">
				<div className="row">
					<div className="col-md-12 col-xl-12 col-xs-12 mx-auto justify-content-md-center">
						<h4 className="mt-5 mb-4 text-info" id="loginFormTitle">
							Hi! {user.name}
						</h4>
					</div>
				</div>				
				<div className="row">
					<div className="col-md-3 col-xs-6 col-md-auto userProfileP">
						<div className="row">
							<div className="col-md-12">
								<img className="img-responsive pb-3 ml-auto" src={photoUrl} alt={user.name} style={{ with: "auto", height: "200px", borderRadius: "5%" }} onError={i => (i.target.src = `${DefaultAvatar}`)} />
							<p>Email: {user.email} </p>
							<p>{`Joined on ${new Date(user.created).toDateString()}`}</p>

							{isAuthenticated().user && 
							isAuthenticated().user._id === user._id ? (
								<div className="col-md-8">
									<Link className="btn btn-raised btn-outline-info mr-3 btn-block mb-3" to={`/post/create`}>
										Create Post
									</Link>
								<Link className="btn btn-raised btn-outline-success mr-3 btn-block mb-3" to={`/user/edit/${user._id}`}>
										Edit Profile
									</Link>
								<DeleteUser userId={user._id} />	
								</div>
							) : (
							<FollowProfileButton 
							following={this.state.following} onButtonClick={this.onClickFollowButton} 
							/>

						)}	
							</div>
								<div className="col-md-8">
								{isAuthenticated().user &&
									isAuthenticated().user.role === "admin" && (
										<>
											<h4 className="mt-3 mb-3 text-info" id="loginFormTitle"> Admin Only
										</h4>
											<Link className="btn btn-raised btn-outline-success mr-3 btn-block mb-3" to={`/user/edit/${user._id}`}>
												Edit Profile
										</Link>
										<DeleteUser userId={user._id} />									
										</>
									)}
								{isAuthenticated().user &&
									isAuthenticated().user.role === "superadmin" && (
										<>
											<h4 className="mt-3 mb-3 text-info" id="loginFormTitle"> Admin Only
										</h4>
											<Link className="btn btn-raised btn-outline-success mr-3 btn-block mb-3" to={`/user/edit/${user._id}`}>
												Edit Profile
										</Link>
											<DeleteUser userId={user._id} />
										</>
									)}
								</div>
						</div>					
					</div>
					<div className="col-md-6 col-xs-6 col-md-auto">
						<div className="row">
							<div className="col-md-12 col-xl-12 col-xs-12 mx-auto userBioDiv">
								<h6 className="mb-4">Write Something About Yourself ...</h6>
								<p className="text-justify">
									{user.userBio}
								</p>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 col-xl-12 col-xs-12 mx-auto userPostsDiv">
								<h6 className="mb-4">Your Recent Posts</h6>		
								{posts.map((post, i) =>
									<div key={i}>
										<div className="row">
											<div className="col-md-7 col-offset-md-5 postsSecDiv">
												<Link to={`/post/${post._id}`}>		
													<p><i className="fa fa-clipboard" aria-hidden="true"></i> {" "}{post.title} </p> 
												</Link>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="col-md-3 col-xs-6 col-md-auto justify-content-md-center followingDiv">
						<div className="row  justify-content-md-center">
							<div className="col-md-12 col-xl-12 col-xs-12 mx-auto userFollowDiv">				
								<div className="card pmd-card">
									<div className="pmd-tabs">
										<ul className="nav nav-tabs nav-fill" role="tablist">
											<li className="nav-item navItemTabs active"><a className="nav-link active" href="#following" aria-controls="home" role="tab" data-toggle="tab"> Followers</a>
											</li>
											<li className="nav-item"><a className="nav-link" href="#followers" aria-controls="about" role="tab" data-toggle="tab">Following</a>
											</li>											
										</ul>
									</div>
									<div className="card-body">
										<div className="tab-content">
											<ProfileTabs 
											followers={user.followers}
											following={user.following} 
											posts={posts}
										/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Profile;