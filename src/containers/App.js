import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
import System from '../routes/System';
import Login from './Auth/Login';
import HomePage from './HomePage/HomePage';
import CustomScrollbars from '../components/CustomScrollbars';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import Doctor from '../routes/Doctor';
import VerifyEmail from './Patient/VerifyEmail';
import DetailClinic from './Patient/Clinic/DetailClinic';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import AllDoctor from './Patient/Doctor/AllDoctor';
import AllSpecialty from './Patient/Specialty/AllSpecialty';
import AllClinic from './Patient/Clinic/AllClinic';
import ForgotPassword from './System/ForgotPassword/ForgotPassword';
import DetailPost from './Patient/Posts/DetailPost';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();

    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <CustomScrollbars style={{ width: '100vw', height: '100vh' }}>
                            <span className="content-container">
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={path.SCHEDULE_DOCTOR} component={userIsAuthenticated(Doctor)} />
                                    <Route path={path.HOMEPAGE} exact component={(HomePage)} />
                                    <Route path={path.DETAIL_DOCTOR} exact component={(DetailDoctor)} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} exact component={(VerifyEmail)} />
                                    <Route path={path.VERIFY_FORGOT_PASSWORD} exact component={(ForgotPassword)} />
                                    <Route path={path.DETAIL_CLINIC} exact component={(DetailClinic)} />
                                    <Route path={path.DETAIL_SPECIALTY} exact component={(DetailSpecialty)} />
                                    <Route path={path.ALL_DOCTOR} exact component={(AllDoctor)} />
                                    <Route path={path.ALL_SPECIALTY} exact component={(AllSpecialty)} />
                                    <Route path={path.ALL_CLINIC} exact component={(AllClinic)} />
                                    <Route path={path.DETAIL_POSTS} exact component={(DetailPost)} />
                                </Switch>
                            </span>
                        </CustomScrollbars>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);