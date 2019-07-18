import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import logo from '../assets/logo.png';
import { signout, isAuthenticated } from '../auth';
import DefaultAvatar from '../assets/default.png';

const isActive = (history, path) => {
	if (history.location.pathname === path) return { color: "#ff9900", borderBottom: "1px solid #ff9900" }; else return { color: "#ffffff" };
};




	

const Navbar = ({history}) => (
	<nav className="navbar navbar-expand-lg navbar-light bg-dark">
		<div className="container-fluid">
			<Link to="/" className="navbar-brand active">
				<img src={logo} alt="Logo" width="30px" height="30px" />
			</Link>
			<button className="navbar-toggler custom-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarNav">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item"><Link to="/" className="nav-link" style={isActive(history, "/")}>Home</Link>
					</li>
					<li className="nav-item"><Link to="/users" className="nav-link" style={isActive(history, "/users")}>Users</Link>
					</li>
					<li className="nav-item"><Link to="/findPeople" className="nav-link" style={isActive(history, "/findPeople")}>Find People</Link>
					</li>
					<li className="nav-item"><Link to="/post/create" className="nav-link" style={isActive(history, "/post/create")}>Create Post</Link>
					</li>
				</ul>
				<ul className="navbar-nav ml-auto">
					
					{!isAuthenticated() && (
						<>
							<li className="nav-item dropdown">
								<span className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									Login / Register
        						</span>
								<div className="dropdown-menu dropdown-menu-right animate slideIn" aria-labelledby="navbarDropdown">
									<Link to="/signin" className="dropdown-item profileID" style={isActive(history, "/signin")}>
										<i className="fa fa-sign-in"></i> &nbsp; Login
									</Link>
									<Link to="/signup" className="dropdown-item profileID" style={isActive(history, "/signup")}>
										<i className="fa fa-user-plus"></i> &nbsp; 	Register
									</Link>
								</div>								
							</li>
						</>
					)}
					
					{isAuthenticated() && (
						<>
							<li className="nav-item dropdown" style={isActive(history, `/user/${isAuthenticated().user._id}`)}>
								<Link to={`/user/${isAuthenticated().user._id}`} className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<img className="img-rounded" src={`${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?`} alt={isAuthenticated().user.name} style={{ borderRadius: "100%", height: "25px", width: "23px" }} onError={i => (i.target.src = `${DefaultAvatar}`)} /> &nbsp; {`${isAuthenticated().user.name}`} 
								</Link>
								<div className="dropdown-menu dropdown-menu-right animate slideIn" aria-labelledby="navbarDropdown">
									<Link to={`/user/${isAuthenticated().user._id}`} className="dropdown-item profileID" style={{ cursor: "pointer" }}>
										<img className="img-rounded" src={`${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}?`} alt={isAuthenticated().user.name} style={{ borderRadius: "100%", height: "20px", width: "20px" }} onError={i => (i.target.src = `${DefaultAvatar}`)} />&nbsp; {`My Profile`}
									</Link>
									{isAuthenticated() && isAuthenticated().user.role === "admin" && (
										<li className="nav-item dropdown"><Link to={`/admin`} className="dropdown-item profileID" style={isActive(history, `/admin`)}> <i className="fa fa-server"></i> &nbsp; Admin</Link>
										</li>
									)}
									{isAuthenticated() && isAuthenticated().user.role === "superadmin" && (
										<li className="nav-item dropdown"><Link to={`/admin`} className="dropdown-item profileID" style={isActive(history, `/admin`)}> <i className="fa fa-server"></i> &nbsp; Admin</Link>
										</li>
									)}
									<Link to={`/user/edit/${isAuthenticated().user._id}`} className="dropdown-item profileID" style={isActive(history, `/user/edit/${isAuthenticated().user._id}`)}>
										<i className="fa fa-cog"></i> &nbsp; Setting
									</Link>
									<span className="dropdown-item aProfile" style={isActive(history, "/signout")} onClick={() => signout(() => history.push('/'))} id="LProfile">
										<i className="fa fa-unlock"></i> &nbsp; Logout
									</span>									
								</div>						
							</li>													
						</>
					)}
					
				</ul>
			</div>
		</div>		
	</nav>
);


export default withRouter(Navbar);