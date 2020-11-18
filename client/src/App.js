import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
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
          <Route exact path='/labtech' component={LabLogin} />
          <Route exact path='/home' component={LabHome} />
          <Route exact path='/test-collection' component={TestCollection} />
          <Route exact path='/pool-mapping' component={PoolMapping} />
          <Route exact path='/well-testing' component={WellTesting} />
          <Route exact path='/employee' component={EmployeeLogin} />
          <Route exact path='/employee-results' component={EmployeeResults} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
