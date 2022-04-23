import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => (
	<React.Fragment>
		{localStorage.getItem("token") !== null ? (
			children
		) : (
			<Navigate to='/login' />
		)}
	</React.Fragment>
);

export default PrivateRoute;
