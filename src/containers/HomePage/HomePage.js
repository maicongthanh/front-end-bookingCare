import { connect } from 'react-redux';
import * as actions from '../../store/actions'
import HomeHeader from './HomeHeader';
import './HomePage.scss';
import Specialty from './Section/Specialty';
import Clinic from './Section/Clinic';
import Doctor from './Section/Doctor';
import HandBook from './Section/HandBook';
import Media from './Section/Media';
import Information from './Section/Information';
import Footer from './Footer';
const HomePage = () => {
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };
    var settingsHandBook = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2
    };

    return (
        <>
            <HomeHeader isShowBanner={true} />
            <Specialty settings={settings} />
            <Clinic settings={settings} />
            <Doctor settings={settings} />
            <HandBook settings={settingsHandBook} />
            <Media />
            <Information />
            <Footer />
        </>
    )
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
