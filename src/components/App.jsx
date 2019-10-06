import React from 'react';
import Chat from './Chat.jsx';

function App(props) {
  const {server} = props;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Welcome to SignalR chat</h1>
      </header>
      <div className='app-container'>
        <Chat server={server} />
      </div>
    </div>
  )
}

export default App;
