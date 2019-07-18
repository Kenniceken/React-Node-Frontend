import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { create} from './apiPost';
import { Redirect } from 'react-router-dom';
// import DefaultAvatar from '../assets/default.png';
// import PrivateRoute from '../auth/PrivateRoute';


class NewPost extends Component {

	constructor() {
		super()
		this.state = {
			title: "",
			body: "",
			photo: "",
			error: "",
			user: {},
			fileSize: 0,
			loading: false,
			redirectToProfile: false
		}
	}

	componentDidMount() {
		this.postData = new FormData();
		this.setState({ user: isAuthenticated().user });
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
	}

	clickSubmit = event => {

		event.preventDefault();
		this.setState({ loading: true });

		if (this.isValid()) {			
			//console.log(user);
			const userId = isAuthenticated().user._id;
			const token = isAuthenticated().token;

			create(userId, token, this.postData).then(data => {

				if (data.error) this.setState({ error: data.error })
				else {
					this.setState({ 
						loading: false, 
						title: "", 
						body: "", 
						photo: "",
						redirectToProfile: true 
					});
				}					
					
			});
		}
	};

	createNewPostForm = (title, body) => (
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
						<label className="custom-file-label" >Choose Photo</label>
				</div>
			</div>
			<button onClick={this.clickSubmit} className="btn btn-raised"><i className="fa fa-plus"></i> Create Post</button>
		</form>
	);



	render() {
		const { 

			title,
			body,
			//photo,
			user,
			error,
			loading,
			redirectToProfile
			
		} = this.state;
		
		if (redirectToProfile) {
			return <Redirect to={`/user/${user._id}`} />;
		}

		return (			
			<div className="container">
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">Creat New Post</h2>

						<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
							<p style={{ fontFamily: "trebuchet" }}>{error}</p>
						</div>
						{loading ? <div className="jumbotron text-center" id="preloader">
							<div id="loader"></div>
						</div> : ""}
											
					</div>
				</div>
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">

						{this.createNewPostForm(title, body)}
					</div>
				</div>
			</div>
		);
	}
}


export default NewPost;