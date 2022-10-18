import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import Loading from './components/Loading';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import { useAuth0 } from '@auth0/auth0-react';

// styles
import './App.css';

// fontawesome
import initFontAwesome from './utils/initFontAwesome';
initFontAwesome();

const TENANT_RE = /[?&]tenant=[^&]+/;

const App = () => {
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useAuth0();

  const searchParams = window.location.search;

  const hasTenantParams = TENANT_RE.test(searchParams);
  const tenant = hasTenantParams && new URLSearchParams(searchParams).get('tenant');

  useEffect(() => {
    if (!tenant && !isLoading && !isAuthenticated) {
      navigate(`/tenant`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant, isAuthenticated, isLoading]);

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id='app' className='d-flex flex-column h-100'>
      <NavBar />
      <Container className='flex-grow-1 mt-5'>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default App;
