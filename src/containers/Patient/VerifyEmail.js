/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './VerifyEmail.scss';
import queryString from 'query-string'
import { postVerifyBookAppointment } from '../../services/userService';
import { useEffect, useState } from 'react';
import HomeHeader from '../HomePage/HomeHeader'
import { LANGUAGES } from '../../utils/constant';

const VerifyEmail = (props) => {
    const { language } = props
    const [statusVerify, setStatusVerify] = useState(false)
    const [errCode, setErrCode] = useState(0)

    const verifyEmailBooking = async () => {
        if (props.location && props.location.search) {
            let parsedHash = queryString.parse(props.location.search);
            let token = parsedHash.token
            let doctorId = parsedHash.doctorId
            let res = await postVerifyBookAppointment({
                token, doctorId
            })
            if (res && res.errCode === 0) {
                setStatusVerify(true)
                setErrCode(res.errCode)
            } else {
                setStatusVerify(true)
                setErrCode(res && res.errCode ? res.errCode : -1)
            }
        }
    }

    useEffect(() => {
        verifyEmailBooking(props)
    }, [])

    return (
        <>
            <HomeHeader />
            <div className='verify-email-container container'>
                {statusVerify === false ?
                    <div>
                        Loading data ...
                    </div>
                    :
                    <div>
                        {+errCode === 0 ?
                            <div className='information-booking'>
                                {language === LANGUAGES.VI ? 'Xác nhận lịch hẹn thành công !' : 'Appointment confirmed successfully !'}
                            </div>
                            :
                            <div className='information-booking'>
                                {language === LANGUAGES.VI ? ' Lịch hẹn đã được xác nhận hoặc không tồn tại !' : 'Appointment confirmed or non-existent !'}

                            </div>
                        }
                    </div>
                }
            </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
