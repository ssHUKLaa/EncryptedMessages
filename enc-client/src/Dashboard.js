import React from 'react';

function Dashboard({ loggedInUser }) {
  return (
    <div>
      <h1>Welcome {loggedInUser}!</h1>
      {/* Other dashboard components */}
    </div>
  );
}

export default Dashboard;