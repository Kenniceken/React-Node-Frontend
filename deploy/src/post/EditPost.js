import React, { Component } from 'react';
import { singlePost, update } from './apiPost';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import DefaultPostPhoto from '../assets/post-default.jpg';


class EditPost extends Component {

	constructor() {
		super()
		this.state = {
			id: "",
			title: "",
			body: "",
			redirectToProfile: false,
			error: "",
			fileSize: 0,
			loading: false

		}
	}


	init = (postId) => {		
		singlePost(postId).then(data => {
			if (data.error) {
				this.setState({ redirectToProfile: true });
			} else {
				this.setState({
					id: data._id,
					title: data.title,
					body: data.body,
					error: ""
				});
			}
		});
	}

	componentDidMount() {
		this.postData = new FormData();
		const postId = this.props.match.params.postId;
		this.init(postId);
	};

	isValid = () => {
		const { title, body, fileSize } = this.state;

		if (fileSize > 100000) {
			this.setState({ error: "File sixe cannot be more than 100ks" });
		}


		if (title.length === 0 || body.length === 0) {
			this.setState({ error: "All fields are Required", loading: false });
			return false;
		}
		return true;
	};


	handleChange = name => event => {

		this.setState({ error: "" });
		const value = name === 'photo' ? event.target.files[0] : event.target.value;

		const fileSize = name === 'photo' ? event.target.files[0].size : 0;
		this.postData.set(name, value);
		this.setState({ [name]: value, fileSize });
	};

	clickSubmit = event => {

		event.preventDefault();
		this.setState({ loading: true });

		if (this.isValid()) {
			//console.log(user);
			const postId = this.state.id;
			const token = isAuthenticated().token;

			update(postId, token, this.postData).then(data => {

				if (data.error) this.setState({ error: data.error })
				else {
					this.setState({
						loading: false,
						title: "",
						body: "",
						redirectToProfile: true
					});
				}

			});
		}
	};


	editPostForm = (title, body) => (
		<form id="formDIV">
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("title")} type="text" className="form-control" value={title} placeholder="Post Title" />
			</div>
			<div className="form-group">
				<label className="text-muted">Post Content</label>
				<textarea className="form-control pt-5 textAreaEdit" onChange={this.handleChange("body")} rows="4" value={body}>

				</textarea>
			</div>
			<div className="form-group">
				<div className="custom-file">
					<input type="file" accept="image/*" className="custom-file-input form-control" onChange={this.handleChange("photo")} />
					<label className="custom-file-label" >Choose Post Photo</label>
				</div>
			</div>
			<button onClick={this.clickSubmit} type="button" className="btn btn-raised"><i className="fa fa-save"></i> Save Post Changes</button>
		</form>
	);


	render() {
		const { id, title, body, redirectToProfile, error, loading } = this.state;

		if (redirectToProfile) {
			return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
		}
		
		return (

			<div className="container" style={{paddingBottom: "40px"}}>
				<div className="row justify-content-md-center">
					<div className="col-md-8 col-offset-md-4">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">{title}</h2>

						<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
							<p style={{ fontFamily: "trebuchet" }}>{error}</p>
						</div>

						{loading ? <div className="jumbotron text-center" id="preloader">
							<div id="loader"></div>
						</div> : ""}

						<img className="img-responsive" src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`} alt={title} style={{ with: "auto", height: "200px", borderRadius: "5%" }} onError={i => (i.target.src = `${DefaultPostPhoto}`)} />
						{this.editPostForm(title, body)}
					</div>
				</div>
			</div>
		);
	}

}

export default EditPost;