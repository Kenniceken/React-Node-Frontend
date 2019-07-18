import React, { Component } from 'react';
import { findPeople, follow } from './apiUser';
import DefaultAvatar from '../assets/default.png';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';


class FindPeople extends Component {

	constructor() {
		super()
		this.state = {
			users: [],
			error: "",
			open: false
		}
	}

	componentDidMount() {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;

		findPeople(userId, token).then(data => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ users: data });
			}
		});
	}

	clickFollow = (user, i) => {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;

		follow(userId, token, user._id)
		.then(data => {
			if (data.error) {
				this.setState({ error: data.error });
			}
			else {
				let toFollow = this.state.users;
				toFollow.splice(i, 1);
				this.setState({
					users: toFollow,
					open: true,
					followMessage: `You are now Following ${user.name}`
				})
			}
		})
	}

	renderUsers = users => (

		<div className="row usersDivs">
			{users.map((user, i) =>	(
				<div className="col-md-3 col-sm-6" key={i}>
					<div className="card text-center lead">
						<img className="card-img-top avatarImg" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i => (i.target.src = `${DefaultAvatar}`)} alt={user.name} style={{ with: "auto", height: "230px", objectFit: "cover", borderRadius: "5%" }} />
					<div className="card-body">
							<h6 className="card-title"> {user.name} </h6>
						<p className="card-text">{user.email}</p>
							<Link to={`/user/${user._id}`}className="btn btn-sm btn-raised btn-outline-secondary mr-1">
								View Profile
							</Link>
							<button onClick={() => this.clickFollow(user, i)} className="btn btn-raised btn-sm btn-outline-success pull-right">
								Start Following
							</button>
					</div>
				</div>
			</div>
			))}
		</div>
	);


	render() {
		const { users, open, followMessage } = this.state;
		return (
			<div className="container-fluid profileBody findPeopleDIV">
				<div className="row">
					<div className="col-md-12 col-xl-12 col-xs-12 mx-auto justify-content-md-center">
						<h2 className="mt-3 mb-5 text-info" id="loginFormTitle">Recommended</h2>

						{open && (
							<div className="alert alert-success" role="alert">
								{open && (<p>{followMessage}</p>)}
							</div>
						)}
					</div>					
				</div>
				{this.renderUsers(users)}		
			</div>
		);
	}
}

export default FindPeople;