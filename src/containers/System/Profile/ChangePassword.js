/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import "./ChangePassword.scss";
import { handleChangePassword } from "../../../services/userService";
import { toast } from 'react-toastify';
import * as actions from "../../../store/actions";

const ChangePassword = (props) => {

    const { language, email, setIsOpenChangePassWord, isOpenOptionChangePassword, setIsOpenForm, processLogout } = props
    const [isSubmit, setIsSubmit] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [errorMessageFromServer, setErrorMessageFromServer] = useState('')

    const [state, setState] = useState({
        passwordCurrent: '',
        passwordChange: '',
        confirmPasswordChange: ''
    })
    const { passwordCurrent, passwordChange, confirmPasswordChange, } = state

    const handleOnChangeInput = (event) => {
        const { name, value } = event.target
        setState({
            ...state,
            [name]: value
        })
        setFormErrors({
            ...formErrors,
            [name]: ''
        })
        setErrorMessageFromServer('')
    }

    const handleIsOpenChangePassword = () => {
        setIsOpenChangePassWord(false)
        setState({
            ...state,
            passwordCurrent: '',
            passwordChange: '',
            confirmPasswordChange: ''
        })
    }

    const validate = (values) => {
        const errors = {};
        if (isOpenOptionChangePassword === true) {
            const arrInput = ['passwordCurrent']
            for (let i = 0; i < arrInput.length; i++) {
                if (!values[arrInput[i]]) {
                    let valueVi = 'Vui lòng không bỏ trống !';
                    let valueEn = `Please don't leave it blank`
                    errors[arrInput[i]] = { valueVi, valueEn }
                }
            }
        }
        //Check null and compare password
        if (!values.passwordChange) {
            errors.passwordChange = {
                valueVi: "Vui lòng không bỏ trống !",
                valueEn: `Please don't leave it blank`
            }
        }

        if (!values.confirmPasswordChange) {
            errors.confirmPasswordChange = {
                valueVi: "Vui lòng không bỏ trống !",
                valueEn: `Please don't leave it blank`
            }
        } else if (values.confirmPasswordChange !== values.passwordChange) {
            errors.confirmPasswordChange = {
                valueVi: "Mật khẩu nhập lại không chính xác",
                valueEn: `Re-entered password is incorrect`
            }
        }

        return errors;
    }

    const handleSubmit = () => {
        setIsSubmit(true)
        setFormErrors(validate(state))
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const handleOnChangePassword = async () => {
                if (isOpenOptionChangePassword === true) {
                    let res = await handleChangePassword({
                        email,
                        passwordCurrent,
                        passwordChange,
                        option: 'TYPE1'
                    })
                    if (res && res.errCode === 4) {
                        let errMessageFromServer = {
                            valueVi: 'Mật khẩu không chính xác',
                            valueEn: 'incorrect password'
                        }
                        setErrorMessageFromServer(errMessageFromServer)
                    } else if (res && res.errCode === 0) {
                        language === LANGUAGES.VI ? toast.success('Đổi mật khẩu thành công') : toast.success('Change password successfully')
                        setState({
                            ...state,
                            passwordCurrent: '',
                            passwordChange: '',
                            confirmPasswordChange: ''
                        })
                    }
                } else {
                    let res = await handleChangePassword({
                        email,
                        passwordChange,
                        option: 'TYPE2'
                    })
                    if (res && res.errCode === 0) {
                        language === LANGUAGES.VI ? toast.success('Đổi mật khẩu thành công') : toast.success('Change password successfully')
                        setState({
                            ...state,
                            passwordChange: '',
                            confirmPasswordChange: ''
                        })
                        setIsOpenForm(false)
                        processLogout()
                    }
                }
            }
            handleOnChangePassword()
        }
    }, [formErrors])


    return (
        <div className="change-password-container">
            <div className="change-password">
                {isOpenOptionChangePassword === true &&
                    <div className="form-group">
                        <label>Mật khẩu hiện tại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={passwordCurrent}
                            name='passwordCurrent'
                            onChange={(event) => handleOnChangeInput(event)}
                        />
                        <span className="error">
                            {errorMessageFromServer ? errorMessageFromServer.valueVi : ''}
                            {formErrors.passwordCurrent ? formErrors.passwordCurrent.valueVi : ''}
                        </span>
                    </div>
                }
                <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                        type="text"
                        className="form-control"
                        value={passwordChange}
                        name='passwordChange'
                        onChange={(event) => handleOnChangeInput(event)}
                    />
                    <span className="error">
                        {formErrors.passwordChange ? formErrors.passwordChange.valueVi : ''}
                    </span>
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <input
                        type="text"
                        className="form-control"
                        value={confirmPasswordChange}
                        name='confirmPasswordChange'
                        onChange={(event) => handleOnChangeInput(event)}
                    />
                    <span className="error">
                        {formErrors.confirmPasswordChange ? formErrors.confirmPasswordChange.valueVi : ''}
                    </span>
                </div>

                <div className="form-group">
                    <button className="btn-change-password"
                        onClick={handleSubmit}
                    >
                        Xác nhận
                    </button>
                    <button
                        className="btn-cancel"
                        onClick={handleIsOpenChangePassword}
                    >
                        Hủy
                    </button>

                </div>
            </div>
        </div >
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);