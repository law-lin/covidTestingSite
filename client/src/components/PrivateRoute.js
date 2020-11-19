import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import employeeService from '../services/employeeService';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeService.authorize().then((res) => {
      res.data ? setAuthenticated(true) : setAuthenticated(false);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  } else {
    return (
      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /signin page
      <Route
        {...rest}
        render={(props) =>
          authenticated ? <Component {...props} /> : <Redirect to='/' />
        }
      />
    );
  }
};

export default PrivateRoute;
