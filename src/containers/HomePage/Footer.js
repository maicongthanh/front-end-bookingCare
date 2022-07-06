import { connect } from 'react-redux';

import './Footer.scss';

const Footer = (props) => {

    return (
        <div className='footer'>
            <div className='container'>
                <div className='footer-content'>
                    <p>&copy; 2022 Mai Công Thành</p>
                    <div className='social'>
                        <span className='icon-facebook'>
                            <i className="fab fa-facebook-f "></i>
                        </span>
                        <span className='icon-youtube'>
                            <i className="fab fa-youtube "></i>
                        </span>

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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
