import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux'
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import { USER_ROLE } from '../utils';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import NotFound from '../containers/System/Admin/NotFound';
import WelcomeAdmin from "../containers/System/Admin/WelcomeAdmin";
import Profile from "../containers/System/Profile/Profile";
import ManagePosts from "../containers/System/Posts/ManagePosts";

const System = (props) => {

    const { systemMenuPath, isLoggedIn, userInfo } = props;

    return (
        <>
            {isLoggedIn && <Header />}
            <div className="system-container">
                <div className="system-list">
                    {userInfo && userInfo.role === USER_ROLE.ADMIN ?
                        <Switch>
                            <Route path="/system/hello-admin" component={WelcomeAdmin} />
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/profile" component={Profile} />
                            <Route path="/system/manage-posts" component={ManagePosts} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                        :
                        <Switch>
                            <Route path="/system/profile" component={Profile} />
                            <Route path="/system/hello-admin" component={WelcomeAdmin} />
                            <Route path="/system/user-manage" component={NotFound} />
                            <Route path="/system/user-redux" component={NotFound} />
                            <Route path="/system/manage-doctor" component={NotFound} />
                            <Route path="/system/manage-clinic" component={NotFound} />
                            <Route path="/system/manage-specialty" component={NotFound} />
                            <Route path="/system/manage-posts" component={NotFound} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    }
                </div>
            </div>
        </>
    )
}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        systemMenuPath: state.app.systemMenuPath,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
