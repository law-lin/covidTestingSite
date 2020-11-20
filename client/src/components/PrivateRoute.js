import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import employeeService from '../services/employeeService';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeService
      .authorize()
      .then((res) => {
        // check if user is logged in
        if (res.data) {
          setAuthenticated(true);
          // check if route is restricted by a particular role
          if (roles && roles.indexOf(localStorage.getItem('role')) === -1) {
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
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
