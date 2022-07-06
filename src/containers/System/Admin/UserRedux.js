/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createNewUserService, editUserApi } from '../../../services/userService';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions/index'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './UserRedux.scss'
import TableManageUser from './TableManageUser';
import { toast } from 'react-toastify';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import localization from 'moment/locale/vi'
import moment from 'moment';
const UserRedux = (props) => {
    const {
        language, isLoadingGender,
        fetchPositionStart, positionRedux,
        fetchGenderStart, genderRedux,
        fetchRoleStart, roleRedux,
        fetchAllUserStart
    } = props

    useEffect(() => {
        fetchGenderStart()
        fetchPositionStart()
        fetchRoleStart()
    }, [])

    const [isOpenForm, setIsOpenForm] = useState(false)

    const [errFromServer, setErrFromServer] = useState({
        valueVi: '',
        valueEn: ''
    })

    const [state, setState] = useState({
        isOpen: false,
        previewImageURL: '',
        id: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        avatar: '',
        gender: '',
        position: '',
        role: '',

        selectedBirthday: '',

        arrGender: [],
        arrRole: [],
        arrPosition: [],

        action: CRUD_ACTIONS.CREATE
    })

    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    const {
        previewImageURL, isOpen,
        email, password, firstName, lastName, address,
        phoneNumber, gender, position, role,
        arrGender, arrRole, arrPosition, action, selectedBirthday
    } = state

    useEffect(() => {
        setState({
            ...state,
            arrGender: genderRedux && genderRedux.length > 0 ? genderRedux : [],
            arrRole: roleRedux && roleRedux.length > 0 ? roleRedux : [],
            arrPosition: positionRedux && positionRedux.length > 0 ? positionRedux : [],

            gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : '',
            position: positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : '',
            role: roleRedux && roleRedux.length > 0 ? roleRedux[1].keyMap : '',
        })
    }, [genderRedux, roleRedux, positionRedux, arrGender, arrPosition, arrRole])

    const handleOnchangeImage = async (event) => {
        const { name } = event.target
        let file = event.target.files[0];
        setFormErrors({
            ...formErrors,
            [name]: '',
        })
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setState({
                ...state,
                previewImageURL: objectUrl,
                avatar: base64
            })
        }
    }
    const handleOpenPrevImage = () => {
        if (!previewImageURL) {
            return;
        }
        setState({
            ...state,
            isOpen: true,
        })
    }

    const handleOnchangeInput = (event) => {
        const { name, value } = event.target
        setState({ ...state, [name]: value })
        setFormErrors({
            ...formErrors,
            [name]: '',
        })
        setErrFromServer('')
    }

    const handleOnchangeDatePicker = (date) => {
        setState({
            ...state,
            selectedBirthday: date.getTime()
        })
        console.log(selectedBirthday);
    }

    const validate = (values) => {
        const errors = {};
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regexPhone = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
        const arrInput = ['firstName', 'lastName', 'address', 'previewImageURL']
        for (let i = 0; i < arrInput.length; i++) {
            if (!values[arrInput[i]]) {
                let valueVi = 'Vui lòng không bỏ trống !';
                let valueEn = `Please don't leave it blank`
                errors[arrInput[i]] = { valueVi, valueEn }
            }
        }

        //email
        if (!values.email) {
            errors.email = {
                valueVi: "Vui lòng không bỏ trống !",
                valueEn: `Please don't leave it blank`
            }
        } else if (!regexEmail.test(values.email)) {
            errors.email = {
                valueVi: "Email không đúng định dạng (Ví dụ : abc@gmail.com)",
                valueEn: `Please enter your email in the correct format (Ex : abc@gmail.com)`
            }
        }

        //password
        if (!values.password) {
            errors.password = {
                valueVi: "Vui lòng không bỏ trống !",
                valueEn: `Please don't leave it blank`
            }
        } else if (values.password.length < 4) {
            errors.password = {
                valueVi: "Mật khẩu phải lớn hơn 4 ký tự!",
                valueEn: `Password must be more than 4 character`
            }
        } else if (values.password.length > 10) {
            errors.password = {
                valueVi: "Mật khẩu phải nhỏ hơn 10 ký tự!",
                valueEn: `Password cannot exceed more than 10 character`
            }
        }

        //phoneNumber
        if (!values.phoneNumber) {
            errors.phoneNumber = {
                valueVi: "Vui lòng không bỏ trống !",
                valueEn: `Please don't leave it blank`
            }
        } else if (!regexPhone.test(values.phoneNumber)) {
            errors.phoneNumber = {
                valueVi: "Số điện thoại không đúng định dạng",
                valueEn: `Please enter your phone in the correct format`
            }
        }

        return errors;
    }

    const handleSaveUser = () => {
        setIsSubmit(true)
        setFormErrors(validate(state))
    }

    const createNewUser = async () => {
        console.log(state);
        let res = await createNewUserService({
            ...state,
        })
        if (res && res.errCode !== 0) {
            setErrFromServer({
                valueVi: language === LANGUAGES.VI ? 'Email đã tồn tại , vui lòng chọn email khác !' : '',
                valueEn: language === LANGUAGES.EN ? 'Email is exist , please try other email !' : '',
            })
        }
        if (res && res.errCode === 0) {
            fetchAllUserStart()
            setState({
                ...state,
                previewImageURL: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                avatar: '',
                selectedBirthday: '',
                gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : '',
                position: positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : '',
                role: roleRedux && roleRedux.length > 0 ? roleRedux[1].keyMap : '',
            })
            setErrFromServer('')

            language === LANGUAGES.VI ? toast.success("Tạo người dùng thành công !") : toast.success(" Create a user success !")
        }
    }

    const handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = Buffer.from(user.image, 'base64').toString('binary');
        }
        setState({
            ...state,
            id: user.id,
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            position: user.position,
            role: user.role,
            action: CRUD_ACTIONS.EDIT,
            previewImageURL: imageBase64,
            avatar: user.avatar,
            selectedBirthday: +user.birthday
        })
    }

    const editUser = async () => {
        let res = await editUserApi({
            ...state
        })
        if (res && res.errCode === 0) {
            fetchAllUserStart()
            setState({
                ...state,
                previewImageURL: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                avatar: '',
                selectedBirthday: '',
                gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : '',
                position: positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : '',
                role: roleRedux && roleRedux.length > 0 ? roleRedux[1].keyMap : '',
                action: CRUD_ACTIONS.CREATE
            })
            language === LANGUAGES.VI ? toast.success("Cập nhật người dùng thành công !") : toast.success(" Update user success !")
        }

    }
    const handleClearErrorValidate = () => {
        setErrFromServer('')
        setFormErrors('-')
    }

    const setStateDelete = () => {
        setState({
            ...state,
            action: CRUD_ACTIONS.CREATE,
            previewImageURL: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            avatar: '',
            gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : '',
            position: positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : '',
            role: roleRedux && roleRedux.length > 0 ? roleRedux[1].keyMap : '',
        })

    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            if (action === CRUD_ACTIONS.CREATE) {
                createNewUser()
            }
            if (action === CRUD_ACTIONS.EDIT) {
                editUser()
            }
        }
    }, [formErrors])


    return (
        <div className='user-redux-container container '>
            <div className='title'>
                <FormattedMessage id="manage-user.add-new-user" />
            </div>
            <div>
                {isLoadingGender === true ? 'Loading...............' : ''}
            </div>
            <div className='row mb-2'>
                <div className='col-12'>
                    <button className='btn btn-primary px-3'
                        onClick={() => setIsOpenForm(!isOpenForm)}
                    >
                        <i className="fas fa-plus"></i>
                        <span className='ml-2'>
                            <FormattedMessage id="admin.manage-doctor.add" />
                        </span>
                    </button>
                </div>
            </div>
            {isOpenForm === true &&
                <>
                    <div className='row'>
                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.Email" />
                            </label>
                            <input
                                value={email}
                                onChange={(event) => handleOnchangeInput(event)}
                                type="text"
                                className='form-control'
                                name="email"
                                disabled={action === CRUD_ACTIONS.EDIT ? true : false}
                            />
                            <p className='error-message'>
                                {formErrors.email && language === LANGUAGES.VI ? formErrors.email.valueVi : ''}
                                {formErrors.email && language === LANGUAGES.EN ? formErrors.email.valueEn : ''}
                                {errFromServer && LANGUAGES.VI ? errFromServer.valueVi : ''}
                                {errFromServer && LANGUAGES.EN ? errFromServer.valueEn : ''}
                            </p>

                        </div>
                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.Password" />
                            </label>
                            <input
                                value={password}
                                onChange={(event) => handleOnchangeInput(event)}
                                type="password"
                                className='form-control'
                                name='password'
                                disabled={action === CRUD_ACTIONS.EDIT ? true : false}
                            />
                            <p className='error-message'>
                                {formErrors.password && language === LANGUAGES.VI ? formErrors.password.valueVi : ''}
                                {formErrors.password && language === LANGUAGES.EN ? formErrors.password.valueEn : ''}
                            </p>
                        </div>

                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.firstName" />
                            </label>
                            <input
                                value={firstName}
                                onChange={(event) => handleOnchangeInput(event)}
                                type="text"
                                className='form-control'
                                name='firstName'

                            />
                            <p className='error-message'>
                                {formErrors.firstName && language === LANGUAGES.VI ? formErrors.firstName.valueVi : ''}
                                {formErrors.firstName && language === LANGUAGES.EN ? formErrors.firstName.valueEn : ''}
                            </p>
                        </div>
                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.lastName" />
                            </label>
                            <input
                                value={lastName}
                                onChange={(event) => handleOnchangeInput(event)}
                                type="text"
                                className='form-control'
                                name='lastName'
                            />
                            <p className='error-message'>
                                {formErrors.lastName && language === LANGUAGES.VI ? formErrors.lastName.valueVi : ''}
                                {formErrors.lastName && language === LANGUAGES.EN ? formErrors.lastName.valueEn : ''}
                            </p>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-3'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.gender" />
                            </label>
                            <select className='form-control'
                                onChange={(event) => handleOnchangeInput(event)}
                                name='gender'
                                value={gender}
                            >
                                {arrGender && arrGender.length > 0 &&
                                    (arrGender).map((item, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={item.keyMap}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.birthday" />
                            </label>
                            <DatePicker
                                className='form-control'
                                selected={selectedBirthday}
                                onChange={(date) => handleOnchangeDatePicker(date)}
                                dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                                maxDate={new Date()}
                                placeholderText={language === LANGUAGES.VI ? 'Vui lòng chọn ngày sinh' : "Please choose birthday"}
                            />
                        </div>
                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.phoneNumber" />
                            </label>
                            <input
                                value={phoneNumber}
                                type="text"
                                className='form-control'
                                onChange={(event) => handleOnchangeInput(event)}
                                name='phoneNumber'
                            />
                            <p className='error-message'>
                                {formErrors.phoneNumber && language === LANGUAGES.VI ? formErrors.phoneNumber.valueVi : ''}
                                {formErrors.phoneNumber && language === LANGUAGES.EN ? formErrors.phoneNumber.valueEn : ''}
                            </p>
                        </div>
                        <div className='col-3 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.address" />
                            </label>
                            <input
                                value={address}
                                type="text"
                                className='form-control'
                                onChange={(event) => handleOnchangeInput(event)}
                                name='address'
                            />
                            <p className='error-message'>
                                {formErrors.address && language === LANGUAGES.VI ? formErrors.address.valueVi : ''}
                                {formErrors.address && language === LANGUAGES.EN ? formErrors.address.valueEn : ''}
                            </p>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-4 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.role" />
                            </label>
                            <select
                                className='form-control'
                                onChange={(event) => handleOnchangeInput(event)}
                                name='role'
                                value={role}
                            >
                                {arrRole && arrRole.length > 0 &&
                                    (arrRole.slice(0, 2)).reverse().map((item, index) => {
                                        return (
                                            <option
                                                key={index} value={item.keyMap}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-4 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.position" />
                            </label>
                            <select
                                className='form-control'
                                onChange={(event) => handleOnchangeInput(event)}
                                name='position'
                                value={position}
                            >
                                {arrPosition && arrPosition.length > 0 &&
                                    arrPosition.map((item, index) => {
                                        return (
                                            <option
                                                key={index} value={item.keyMap}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-4 form-group'>
                            <label className='label'>
                                <FormattedMessage id="manage-user.image" />
                            </label>
                            <div className='preview-image-container'>
                                <input
                                    type='file'
                                    id='upload-image'
                                    hidden
                                    onChange={(event) => handleOnchangeImage(event)}
                                    name='previewImageURL'
                                />
                                <label htmlFor='upload-image' className='btn-upload-image'>
                                    <span>
                                        Tải ảnh
                                    </span>
                                    <i className="fas fa-upload"></i>
                                </label>
                                <p className='error-message'>
                                    {formErrors.previewImageURL && language === LANGUAGES.VI ? formErrors.previewImageURL.valueVi : ''}
                                    {formErrors.previewImageURL && language === LANGUAGES.EN ? formErrors.previewImageURL.valueEn : ''}
                                </p>
                                <div
                                    className='preview-image'
                                    style={{ backgroundImage: `url(${previewImageURL})` }}
                                    onClick={handleOpenPrevImage}
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className={action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-2 mt-3' : 'btn btn-primary px-2 mt-3'}
                        onClick={handleSaveUser}
                    >
                        {
                            action === CRUD_ACTIONS.EDIT ? <FormattedMessage id="manage-user.edit" /> : <FormattedMessage id="manage-user.add" />
                        }
                    </button>
                </>
            }
            <TableManageUser
                handleEditUserFromParent={handleEditUserFromParent}
                handleClearErrorValidate={handleClearErrorValidate}
                setStateDelete={setStateDelete}
            />

            {isOpen === true &&
                <Lightbox
                    mainSrc={previewImageURL}
                    onCloseRequest={() => setState({ ...state, isOpen: false })}
                />
            }
        </div>

    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
        fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
        fetchAllUserStart: () => dispatch(actions.fetchAllUserStart())

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
