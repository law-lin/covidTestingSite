import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import LabLogin from './components/LabLogin';
import LabHome from './components/LabHome';
import TestCollection from './components/TestCollection';
import PoolMapping from './components/PoolMapping';
import WellTesting from './components/WellTesting';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeResults from './components/EmployeeResults';

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/labtech' component={LabLogin} />
          <PrivateRoute
            exact
            path='/home'
            roles={['lab_employee']}
            component={LabHome}
          />
          <PrivateRoute
            exact
            path='/test-collection'
            roles={['lab_employee']}
            component={TestCollection}
          />
          <PrivateRoute
            exact
            path='/pool-mapping'
            roles={['lab_employee']}
            component={PoolMapping}
          />
          <PrivateRoute
            exact
            path='/well-testing'
            roles={['lab_employee']}
            component={WellTesting}
          />
          <Route
            exact
            path='/employee'
            roles={['employee']}
            component={EmployeeLogin}
          />
          <PrivateRoute
            exact
            path='/employee-results'
            roles={['employee']}
            component={EmployeeResults}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
