import React, { Component } from 'react';
import { list } from './apiUser';
import DefaultAvatar from '../assets/default.png';
import { Link } from 'react-router-dom';


class Users extends Component {

	constructor() {
		super()
		this.state = {
			users: []
		}
	}

	componentDidMount() {
		list().then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ users: data });
			}
		});
	}

	renderUsers = (users) => (

		<div className="row usersDivs">
			{users.map((user, i) =>	(
				<div className="col-md-3 col-sm-6" key={i}>
					<div className="card text-center lead userCols">
						<img className="card-img-top avatarImg" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i => (i.target.src = `${DefaultAvatar}`)} alt={user.name} style={{ with: "auto", height: "230px", objectFit: "cover", borderRadius: "5%" }} />
					<div className="card-body">
							<h6 className="card-title"> {user.name} </h6>
						<p className="card-text">{user.email}</p>
							<Link to={`/user/${user._id}`}className="btn btn-raised btn-sm btn-outline-secondary">View Profile</Link>
					</div>
				</div>
			</div>
			))}
		</div>
	);


	render() {
		const { users } = this.state;
		return (
			<div className="container-fluid profileBody">
				<div className="row">
					<div className="col-md-12 col-xl-12 col-xs-12 mx-auto justify-content-md-center">
						<h2 className="mt-3 mb-5 text-info" id="loginFormTitle">Users</h2>
					</div>					
				</div>
				{this.renderUsers(users)}		
			</div>
		);
	}
}

export default Users;