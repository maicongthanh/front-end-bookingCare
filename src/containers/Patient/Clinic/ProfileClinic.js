/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils/constant';
import './ProfileClinic.scss'

const ProfileClinic = (props) => {

    const { language, data } = props
    let backgroundBase64;
    if (data) {
        backgroundBase64 = Buffer.from(data.background, 'base64').toString('binary');
    }

    return (
        <div className='profile-clinic-container'>
            <div className='clinic-item'>
                <div
                    className='image-clinic'
                    style={{
                        backgroundImage: `url(${backgroundBase64})`
                    }}
                >

                </div>
                <span className='clinic-name'>
                    {language === LANGUAGES.VI ? data.nameVi : data.nameEn}
                </span>
            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileClinic);
