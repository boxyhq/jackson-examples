import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Loading from './components/Loading';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './views/Home';
import Profile from './views/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import history from './utils/history';

// styles
import './App.css';

// fontawesome
import initFontAwesome from './utils/initFontAwesome';
import TenantForm from './views/TenantForm';
initFontAwesome();

const TENANT_RE = /[?&]tenant=[^&]+/;

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  const searchParams = window.location.search;

  const hasTenantParams = TENANT_RE.test(searchParams);
  const tenant = hasTenantParams && new URLSearchParams(searchParams).get('tenant');

  useEffect(() => {
    if (!tenant && !isLoading && !isAuthenticated) {
      history.push(`/tenant`);
    }
  }, [tenant, isAuthenticated, isLoading]);

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id='app' className='d-flex flex-column h-100'>
        <NavBar />
        <Container className='flex-grow-1 mt-5'>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/profile' component={Profile} />
            <Route path='/tenant' component={TenantForm} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
