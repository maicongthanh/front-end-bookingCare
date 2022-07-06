import { connect } from 'react-redux';
// import * as actions from '../../store/actions'
import './Information.scss';
import logo from '../../../assets/logo.svg'
import imageCheck from '../../../assets/check1.svg'
import { FormattedMessage } from 'react-intl';

const Information = (props) => {

    const { language } = props

    return (
        <div className='section-share information'>
            <div className='container'>
                <div className='section-content information row'>
                    <div className="col-sm-6  information-left">
                        <div
                            className="information-logo"
                            style={{
                                backgroundImage:
                                    `url(${logo})`
                            }}
                        >
                        </div>
                        <div className='information-body'>
                            <h3>
                                <FormattedMessage id="patient.information.title1" />
                            </h3>
                            <div className='information-address'>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>
                                    <FormattedMessage id="patient.information.title2" />
                                </span>
                            </div>
                            <div className='information-date'>
                                <i className="fas fa-check"></i>
                                <span>
                                    <FormattedMessage id="patient.information.title3" />
                                </span>
                            </div>
                        </div>

                        <div className='information-register'>
                            <div
                                className='image-check'
                                style={{
                                    backgroundImage:
                                        `url(${imageCheck})`
                                }}
                            >
                            </div>
                            <div
                                className='image-check'
                                style={{
                                    backgroundImage:
                                        `url(${imageCheck})`
                                }}
                            >
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3 information-center">
                        <ul>
                            <li>   <FormattedMessage id="patient.information.title4" /></li>
                            <li>   <FormattedMessage id="patient.information.title5" /></li>
                            <li>   <FormattedMessage id="patient.information.title6" /></li>
                            <li>   <FormattedMessage id="patient.information.title7" /></li>
                            <li>   <FormattedMessage id="patient.information.title8" /></li>
                            <li>   <FormattedMessage id="patient.information.title9" /></li>
                        </ul>
                    </div>
                    <div className="col-sm-3 information-right">
                        <div className="information-right-content">
                            <h3>   <FormattedMessage id="patient.information.title10" /></h3>
                            <span>   <FormattedMessage id="patient.information.title11" /></span>
                        </div>
                        <div className="information-right-content">
                            <h3>   <FormattedMessage id="patient.information.title12" /></h3>
                            <span>   <FormattedMessage id="patient.information.title13" /></span>
                        </div>
                        <div className="information-right-content">
                            <h3>   <FormattedMessage id="patient.information.title14" /></h3>
                            <span>   <FormattedMessage id="patient.information.title15" /></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Information);