import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, type, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      (localStorage.getItem('token') !== null &&
        localStorage.getItem('type') === type) ?
        (<Component {...props} />)
        :
        (<Redirect to="/" />)
    }
  />
);


export default PrivateRoute;
