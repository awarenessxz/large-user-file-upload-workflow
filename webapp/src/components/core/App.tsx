import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./NavBar";
import './App.css';

const UploaderFSPage = React.lazy(() => import("../uploader/UploaderFSPage"));
const UploaderS3Page = React.lazy(() => import("../uploader/UploaderS3Page"));
const PageNotFound = React.lazy(() => import("./PageNotFound"));

const App = () => {
    return (
        <div id="page-top">
            <Router>
                <NavBar />
                <div className="app-main">
                    <React.Suspense fallback="Loading...">
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to="/upload-fs"/>}/>
                            <Route exact path="/upload-fs" component={UploaderFSPage}/>
                            <Route exact path="/upload-s3" component={UploaderS3Page}/>
                            <Route path="*" component={PageNotFound}/>
                        </Switch>
                    </React.Suspense>
                </div>
            </Router>
        </div>
    );
}

export default App;
