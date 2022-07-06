/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils/constant';
import './ProfileSpecialty.scss'

const ProfileSpecialty = (props) => {

    const { language, data } = props

    let imageBase64;
    if (data) {
        imageBase64 = Buffer.from(data.image, 'base64').toString('binary');
    }

    return (
        <div className='profile-specialty-container'>
            <div className='specialty-item'>
                <div
                    className='image-specialty'
                    style={{
                        backgroundImage: `url(${imageBase64})`
                    }}
                >

                </div>
                <span className='specialty-name'>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSpecialty);
