import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../assets/default.png';

class ProfileTabs extends Component {


	render() {
		const {following, followers} = this.props 
		return (
			<>			
				<div role="tabpanel" className="tab-pane" id="followers">				
					{followers.map((person, i) => 
						 <div key={i}>
							<div className="row">
								<div className="col-md-12">
									<Link to={`/user/${person._id}`} className="mb-3">
										<img 
										className="pull-left mr-2 mb-2"
											style={{ height: "30px", borderRadius: "50%", width: "30px", border: "1px solid rgba(54,54,54,0.63)" }}
										onError={i => (i.target.src = `${DefaultAvatar}`)}
										src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} 
										/>
										<p style={{
											fontWeight: "normal",
											fontSize: "16px"
										}}>{person.name}</p>
									</Link>									
								</div>
							</div>
						</div>
					)}
				</div>
				<div role="tabpanel" className="tab-pane active" id="following">
					{following.map((person, i) =>
						<div key={i}>
							<div className="row">
								<div className="col-md-12">
									<Link to={`/user/${person._id}`} className="mb-3">
										<img
											className="pull-left mr-2 mb-2"
											style={{ height: "30px", borderRadius: "50%", width: "30px", border: "1px solid rgba(54,54,54,0.63)" }}
											onError={i => (i.target.src = `${DefaultAvatar}`)}
											src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name}
										/>
										<p style={{
											fontWeight: "normal",
											fontSize: "16px"
										}}>{person.name}</p>
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</>
		)
	}
}

export default ProfileTabs;