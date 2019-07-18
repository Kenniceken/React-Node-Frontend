import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultAvatar from '../assets/default.png';


class EditProfile extends Component {

	constructor() {
		super()
		this.state = {
			id: "",
			name: "",
			email: "",
			password: "",
			redirectToProfile: false,
			error: "",
			fileSize: 0,
			loading: false,
			userBio: "",
			role: ""
		}
	}

	init = userId => {
		const token = isAuthenticated().token;
		read(userId, token).then(data => {
			if (data.error) {
				this.setState({ redirectToProfile: true });
			} else {
				this.setState({
					id: data._id,
					name: data.name,
					email: data.email,
					error: "",
					userBio: data.userBio,
					role: data.role
				});
			}
		});
	};

	componentDidMount() {
		this.userData = new FormData();
		const userId = this.props.match.params.userId;
		this.init(userId);
	};


	isValid = () => {
		const { name, email, password, fileSize } = this.state;

		if (fileSize > 1000000) {
			this.setState({
				error: "File size should be less than 100kb",
				loading: false
			});
			return false;
		}

		
		if (name.length === 0) {
			this.setState({ error: "Name cannot be empty", loading: false });
			return false;
		}
		// regular expression email format
		if (!/^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/.test(email)) {
			this.setState({ error: "A Valid Email is Required and cannot be empty", loading: false });
			return false;
		}
		if (password.length >= 1 && password.length <= 5) {
			this.setState({ 
				error: "Password must be at least 6 characters with a number combination", loading: false 
			});
			return false;
		}
		return true;
	};


	handleChange = name => event => {

		this.setState({ error: "" });
		const value = name === 'photo' ? event.target.files[0] : event.target.value;
		
		const fileSize = name === 'photo' ? event.target.files[0].size : 0;
		this.userData.set(name, value);
		this.setState({ [name]: value, fileSize });
	}

	clickSubmit = event => {

		event.preventDefault();
		this.setState({ loading: true });

		if (this.isValid()) {			
			//console.log(user);
			const userId = this.props.match.params.userId;
			const token = isAuthenticated().token;

			update(userId, token, this.userData).then(data => {

				if (data.error) {
					this.setState({ error: data.error });
					// if admin only redirect
				} else if (isAuthenticated().user.role === "admin" || "superadmin") {
					this.setState({
						redirectToProfile: true
					});

				}
				else {
					// if same user update localStorage and redirect
					updateUser(data, () => {
						this.setState({
							redirectToProfile: true
						});
					});
				}
					
			});
				
		}
	};





	signupForm = (name, email, password, userBio, role) => (
		<form id="formDIV">
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("name")} type="text" className="form-control" value={name} placeholder="Name" />
			</div>
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("email")} type="email" className="form-control" value={email} placeholder="Email" />
			</div>
			<div className="form-group">
				<label className="text-muted"></label>
				<input onChange={this.handleChange("password")} type="password" className="form-control" value={password} placeholder="Password" />
			</div>
			<div className="form-group">
				<label className="text-muted">About Me</label>
				 <textarea className="form-control pt-5 textAreaEdit" onChange={this.handleChange("userBio")} rows="4" value={userBio}>

				 </textarea>
			</div>
			<>
				{isAuthenticated().user.role === "superadmin" && (<div className="form-group">
					<label className="text-muted"></label>
					<input onChange={this.handleChange("role")} type="text" className="form-control" value={role} placeholder="User Role" />
				</div>)}
			</>
			
			<div className="form-group">
				<div className="custom-file">
					<input type="file" accept="image/*" className="custom-file-input form-control" onChange={this.handleChange("photo")} />
						<label className="custom-file-label" >Choose Photo</label>
				</div>
			</div>
			<button onClick={this.clickSubmit} className="btn btn-raised"><i className="fa fa-save"></i> Save Changes</button>
		</form>
	);



	render() {
		const { 
			id, 
			name, 
			email, 
			password, 
			redirectToProfile, 
			error, 
			loading,
			userBio,
			role
		} = this.state;
		
		if (redirectToProfile) {
			return <Redirect to={`/user/${id}`} />;
		}

		const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultAvatar;

		return (			
			<div className="container userEditProfile">
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">
						<h2 className="mt-5 mb-5 text-info" id="loginFormTitle">Edit Profile</h2>

						<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
							<p style={{ fontFamily: "trebuchet" }}>{error}</p>
						</div>
						{loading ? <div className="jumbotron text-center" id="preloader">
							<div id="loader"></div>
						</div> : ""}
						<img className="img-responsive" src={photoUrl} alt={name} style={{ with: "auto", height: "200px", borderRadius: "5%" }} onError={i => (i.target.src = `${DefaultAvatar}`)} />						
					</div>
				</div>
				<div className="row justify-content-md-center">
					<div className="col-md-6 col-offset-md-6">

						{isAuthenticated().user.role === "admin" &&
							this.signupForm(name, email, password, userBio)}
						{isAuthenticated().user.role === "superadmin" &&
							this.signupForm(name, email, password, userBio, role)}
						{isAuthenticated().user._id === id &&
							this.signupForm(name, email, password, userBio)}
					</div>
				</div>
			</div>
		);
	}
}


export default EditProfile;