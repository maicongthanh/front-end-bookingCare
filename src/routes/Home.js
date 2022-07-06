import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Home = (props) => {
    const { isLoggedIn, systemMenuPath } = props
    const linkToRedirect = isLoggedIn ? systemMenuPath : '/home';
    return (
        <Redirect to={linkToRedirect} />
    )
}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        systemMenuPath: state.app.systemMenuPath,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
