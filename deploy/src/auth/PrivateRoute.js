import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';


const PrivateRoute = ({ component: Component, ...rest }) => (
	// props here means component passed into the PrivateRoute
	<Route {...rest} render={props => isAuthenticated() ? (
		<Component {...props} />

	) : (
			<Redirect 
			to={{ 
				pathname: "/signin", 
				state: { from: props.location } 
			}} 
			/>
		)
} 
	/>
);

export default PrivateRoute;