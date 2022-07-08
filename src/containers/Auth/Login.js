/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from '../../store/actions'
import './Login.scss';
import { handleForgotPassword, handleLoginApi } from '../../services/userService'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { STATUS } from '../../utils/constant';
import { toast } from 'react-toastify';
const Login = ({ userLoginSuccess, language }) => {


    const [emailForgot, setEmailForgot] = useState('')

    const [errServerForgotPassword, setErrServerForgotPassword] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const formik = useFormik({
        initialValues: {
            emailForgot: ''
        },
        validationSchema: Yup.object({
            emailForgot: Yup.string()
                // .max(15, 'Must be 15 characters or less')
                .required('Vui lòng không để trống')
                .email('Email không đúng định dạng')
        }),
        onSubmit: async (values) => {
            setIsSubmit(true)
            let res = await handleForgotPassword({
                email: values.emailForgot,
                statusId: STATUS.NEW,
                language: language,
                timeDate: (new Date().getTime())
            })
            if (res && res.errCode === 0) {
                formik.values.emailForgot = ''
                toast.success('Vui lòng kiểm tra email để xác nhận')
            } else {
                setErrServerForgotPassword('Email không tồn tại , vui lòng thử lại !')
            }
        }
    })


    const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false)
    const [loginForm, setLogionForm] = useState({
        email: '',
        password: '',
    })
    const [errMessage, setErrMessage] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false)

    const { email, password } = loginForm
    const handleOnchangeInput = (event) => {
        setLogionForm({
            ...loginForm,
            [event.target.name]: event.target.value
        })
    }

    const handleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const handleSubmit = async ({ email, password }) => {
        setErrMessage('')
        try {
            let data = await handleLoginApi(email, password)
            if (data && data.errCode !== 0) {
                setErrMessage(data.message)
            }
            if (data && data.errCode === 0) {
                userLoginSuccess(data.user)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit({ email, password })
        }
    }

    useEffect(() => {
        if (isSubmit === true && errServerForgotPassword)
            setErrServerForgotPassword('')
    }, [formik.values.emailForgot])

    return (
        <div className='login-background'>
            <div className='login-container'>
                <div className='login-content row'>
                    {isOpenForgotPassword === false ? (
                        <>
                            <div className='col-12 text-center login-title'>Login</div>
                            <div className='col-12 form-group'>
                                <label>Email</label>
                                <input
                                    type="text"
                                    className='form-control login-input'
                                    value={email}
                                    onChange={(event) => handleOnchangeInput(event)}
                                    name='email'
                                    onKeyDown={(event) => handleKeyDown(event)}
                                />
                            </div>
                            <div className='col-12 form-group mt-3'>
                                <label>Password</label>
                                <div className='login-password'>
                                    <input
                                        type=
                                        {isShowPassword ? 'text' : 'password'}
                                        className='form-control login-input'
                                        value={password}
                                        onChange={(event) => handleOnchangeInput(event)}
                                        name='password'
                                        onKeyDown={(event) => handleKeyDown(event)}

                                    />
                                    <span
                                        onClick={() => handleShowPassword()}
                                    >
                                        <i className=
                                            {isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'}
                                        ></i>
                                    </span>
                                </div>
                            </div>
                            <div className='col-12 errMessage' style={{ color: 'red' }}>
                                {errMessage}
                            </div>
                            <div className='col-12 mt-3'>
                                <button
                                    className='login-btn'
                                    onClick={() => handleSubmit(loginForm)}
                                >
                                    Log in
                                </button>
                            </div>
                            <div className='col-12'>
                                <span className='login-forgot'
                                    onClick={() => setIsOpenForgotPassword(!isOpenForgotPassword)}
                                >
                                    Forgot your password ?
                                </span>
                            </div>

                            <div className='col-12 login-social'>
                                <span className='social-title'>Or sign in with:</span>
                                <div className='login-icon'>
                                    <i className="fab fa-facebook-f icon-facebook"></i>
                                    <i className="fab fa-google-plus-g icon-google"></i>
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            <form onSubmit={formik.handleSubmit} className='form-forgot-password'>
                                <div className='col-12 text-center login-title'>Forgot password</div>
                                <div className='col-12 form-group'>
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        className='form-control login-input'
                                        value={formik.values.emailForgot}
                                        name='emailForgot'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                    />
                                    {
                                        formik.touched.emailForgot &&
                                            formik.errors.emailForgot ? <p style={{ color: 'red', fontWeight: 'bold' }}>{formik.errors.emailForgot}</p> : null}
                                    {errServerForgotPassword ? <p style={{ color: 'red', fontWeight: 'bold' }}>{errServerForgotPassword}</p> : ''}
                                </div>
                                <div className='col-12 mt-3'>
                                    <button
                                        className='login-btn'
                                        type='submit'
                                    >
                                        Send email
                                    </button>
                                </div>
                                <div className='col-12'>
                                    <span className='login-forgot'
                                        onClick={() => setIsOpenForgotPassword(!isOpenForgotPassword)}
                                    >
                                        Log in
                                    </span>
                                </div>
                            </form>
                        )}
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
