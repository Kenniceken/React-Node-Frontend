import React from 'react';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import Posts from '../post/Posts';

const Home = () => (

	

	<div>
		{isAuthenticated() && (
			<div className="jumbotron">
				<h2>Home</h2>
				<Link to={`/user/${isAuthenticated().user._id}`} className="homeLink">
					Hi! {isAuthenticated().user.name}
				</Link>
				<p className="text-muted mt-3">Welcome to React Node JS Frontend</p>
			</div>	
		)}


		{!isAuthenticated() && (
			<div className="jumbotron">
				<h2>Home</h2>
				<p className="text-muted mt-3">Welcome to React Node JS Frontend</p>
			</div>
		)}

		<div className="container-fluid">
			
			<Posts />
		</div>
	</div>

);

export default Home;