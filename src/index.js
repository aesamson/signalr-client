import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

import './styles.css';

ReactDOM.render(<App server='http://localhost:5000' />, document.getElementById('app'));
