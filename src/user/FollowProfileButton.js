import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';


export class FollowProfileButton extends Component {

	followClick = () => {
		this.props.onButtonClick(follow)
	};

	unfollowClick = () => {
		this.props.onButtonClick(unfollow)
	};


	render() {
		return (

			<div className="d-inline-block">
			{!this.props.following ? (
				<button onClick={this.followClick} className="btn-sm btn btn-primary btn-raised mt-3 mr-3">
					Follow
				</button>
				) : (
				<button onClick={this.unfollowClick} className="btn-sm btn btn-warning btn-raised mt-3">
					UnFollow
				</button>
				)}				
			</div>
		);
	}
}

export default FollowProfileButton;