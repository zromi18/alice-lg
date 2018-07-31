
// Stylesheets
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';
import './assets/scss/main.css';


// App
import React from 'react';
import ReactDOM from 'react-dom';
import AliceApp from './app';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AliceApp />, document.getElementById('root'));
registerServiceWorker();
