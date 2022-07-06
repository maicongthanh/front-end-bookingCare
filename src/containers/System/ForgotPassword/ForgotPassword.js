/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './ForgotPassword.scss';
import queryString from 'query-string'
import { verifyForgotPassword } from '../../../services/userService';
import { LANGUAGES, STATUS } from '../../../utils';
import ChangePassword from '../Profile/ChangePassword';
const ForgotPassword = (props) => {
    const { language } = props
    const [statusVerifyForgotPassword, setStatusVerifyForgotPassword] = useState(false)
    const [errCode, setErrCode] = useState(0)

    const [isOpenForm, setIsOpenForm] = useState(true)

    let email, token;
    if (props.location && props.location.search) {
        let parsedHash = queryString.parse(props.location.search);
        email = parsedHash.email
        token = parsedHash.token
    }
    const verifyEmailForgotPassword = async () => {
        let res = await verifyForgotPassword({
            token,
            email,
            newTimeDate: (new Date()).getTime()
        })
        if (res && res.errCode === 0) {
            setStatusVerifyForgotPassword(true)
            setErrCode(res.errCode)
        } else if (res && res.errCode === 2) {
            setStatusVerifyForgotPassword(true)
            setErrCode(res && res.errCode ? res.errCode : -1)
        } else if (res && res.errCode === 3) {
            setStatusVerifyForgotPassword(true)
            setErrCode(res && res.errCode ? res.errCode : -1)
        }
    }
    useEffect(() => {
        verifyEmailForgotPassword(props)
    }, [])
    return (
        <>
            <HomeHeader />
            {statusVerifyForgotPassword === false ?
                <div>
                    Loading ...
                </div>
                :
                <div className='forgot-password-container container'>
                    {+errCode === 0 &&
                        <div >
                            {isOpenForm === true ?
                                <ChangePassword
                                    email={email}
                                    setIsOpenForm={setIsOpenForm}
                                />
                                :
                                <div className='content-message'>
                                    <span >
                                        {language === LANGUAGES.VI ? ' Mật khẩu đã được thay đổi thành công !' : 'Password has been changed successfully!'}
                                    </span>
                                </div>
                            }
                        </div>
                    }
                    {+errCode === 2 &&
                        <div className='content-message'>
                            <span>
                                {language === LANGUAGES.VI ? ' Mật khẩu đã được thay đổi thành công hoặc không tồn tại !' : 'Password has been changed successfully or does not exist !'}
                            </span>
                        </div>
                    }
                    {+errCode === 3 &&
                        <div className='content-message'>
                            <span>
                                {language === LANGUAGES.VI ? ' Email đã hết hiệu lực , vui lòng thử lại !' : 'Email has expired, please try again !'}
                            </span>
                        </div>
                    }
                </div>

            }
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
