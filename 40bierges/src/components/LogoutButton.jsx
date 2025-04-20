
import React from 'react';
import { withRouter } from 'react-router-dom';
import tools from '../toolBox';

function LogoutButton({ history }) {
  const handleLogout = () => {
    tools.logout();
    // redirect to login
    history.push('/login');
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}

export default withRouter(LogoutButton);
