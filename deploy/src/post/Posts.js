import React, { Component } from 'react';
import { list } from './apiPost';
import DefaultPostPhoto from '../assets/post-default.jpg';
import { Link } from 'react-router-dom';


class Posts extends Component {

	constructor() {
		super()
		this.state = {
			posts: [],
			page: 1
		}
	}

	loadPosts = page => {
		list(page).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ posts: data });
			}
		});
	};

	componentDidMount() {
		this.loadPosts(this.state.page);
	}

	loadMore = number => {
		this.setState({ page: this.state.page + number });
		this.loadPosts(this.state.page + number);
	};

	loadLess = number => {
		this.setState({ page: this.state.page - number });
		this.loadPosts(this.state.page - number);
	};




	renderPosts = posts => {

		return  (
			<div className="row usersDivs">
				{posts.map((post, i) => {
					const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
					const posterName = post.postedBy ? post.postedBy.name : " Anonymous";
					
					return (
						<div className="col-md-3 col-sm-6" key={i} >
							<div className="card lead" style={{ height: "450px" }}>
								<div className="card-body">
									<img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} alt={post.title}
										onError={i => i.target.src = `${DefaultPostPhoto}`}
										className="img-fluid mb-3 postImageDiv"
										style={{ height: "100px", width: "auto" }}
									/>
									<h6 className="card-title cardTitle text-center"> {post.title} </h6>
									<p className="card-text cardTexts">{post.body.substring(0, 50)}{"..."}</p>
									<hr />
									<p className="font-italic mark posterNameText">
										Posted By <Link to={`${posterId}`} className="posterNameLink">{posterName}{" "}</Link>
										{" "} on {new Date(post.created).toDateString()}
									</p>
									<Link to={`/post/${post._id}`} className="btn btn-raised btn-sm btn-outline-secondary">Read More</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		)
	}


	render() {
		const { posts, page } = this.state;
		return (
			<div className="container-fluid profileBody">
				<div className="row">
					<div className="col-md-12 col-xl-12 col-xs-12 mx-auto justify-content-md-center">
						<h2 className="mt-3 mb-5 text-info" id="loginFormTitle">
							{!posts.length ? (
								<div className="jumbotron text-center" id="preloader">
									<div id="loader"></div>
								</div>
							) : "Recent Posts"}
						</h2>
					</div>					
				</div>
				{this.renderPosts(posts)}
			</div>
		);
	}
}

export default Posts;