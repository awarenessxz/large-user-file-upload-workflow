import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/core/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const render = (AppComponent: React.FC): void => {
    ReactDOM.render(
        <React.StrictMode>
            <AppComponent />
        </React.StrictMode>,
        document.getElementById('root')
    );
};

// renders application on first load
render(App);

// webpack dev server : Hot Module Replacement
if (module.hot) {
    module.hot.accept('./components/core/App', () => {
        const NextApp = require('./components/core/App').default;
        render(NextApp);
    });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
