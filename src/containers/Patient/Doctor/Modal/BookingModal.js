/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './BookingModal.scss'
import localization from 'moment/locale/vi'
import { FormattedMessage } from 'react-intl';
import { Modal } from "reactstrap";
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { bookingCareAppointment, getAllCodeApi, getDetailDistrictByProvince, getDetailClinicDoctorById } from '../../../../services/userService';
import { LANGUAGES, customStyles, STATUS, USER_ROLE } from '../../../../utils/constant';
import Select from 'react-select';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

import moment from 'moment';

import LoadingOverlay from 'react-loading-overlay';
import { emitter } from '../../../../utils/emitter';

const BookingModal = (props) => {
    const [isShowLoading, setIsShowLoading] = useState(false)
    const { isOpenModal, setIsOpenModal, dataTime, language, setIsRenderBookingModal } = props

    const toggle = () => {
        setIsOpenModal()
        setIsRenderBookingModal()
    }
    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : ''

    useEffect(() => {
        fetchAllData()

        return () => {
            setList([])
        }
    }, [])

    const [state, setState] = useState({
        selectedGender: '',
        selectedProvince: '',
        selectedDistrict: '',
        currentDate: '',

        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        reason: '',
        doctorName: '',
    })
    const { selectedGender, selectedProvince, selectedDistrict, currentDate,
        email, firstName, lastName, phoneNumber, address, reason

    } = state

    const [list, setList] = useState({
        listGender: [],
        listProvince: [],
        listDistrict: [],
        ClinicDoctor: {},
    })
    const { listGender, listProvince, listDistrict, ClinicDoctor } = list


    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const [errorMessageFromServer, setErrorMessageFromServer] = useState('')

    const validate = (values) => {
        const errors = {};
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regexPhone = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/

        const arrInput = ['firstName', 'lastName', 'address', 'reason',
            'selectedGender', 'selectedProvince', 'selectedDistrict', 'currentDate'
        ]
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

    const fetchAllData = async () => {
        let resGenders = await getAllCodeApi("GENDER")
        let resProvince = await getAllCodeApi("PROVINCE")
        let resProfileDoctor = await getDetailClinicDoctorById(doctorId)
        if (resGenders && resGenders.errCode === 0 && resProvince && resProvince.errCode === 0 && resProfileDoctor.errCode === 0) {
            let dataGender = buildDataSelect(resGenders.data)
            let dataProvince = buildDataSelect(resProvince.data)
            setList({
                ...list,
                listGender: dataGender,
                listProvince: dataProvince,
                ClinicDoctor: resProfileDoctor.data.clinicTypeData
            })
        }
    }

    const buildDataSelect = (inputData) => {
        let result = []
        inputData.map((item) => {
            let object = {}
            let labelVi = item.valueVi
            let labelEn = item.valueEn
            object.label = language === LANGUAGES.VI ? labelVi : labelEn
            object.value = item.keyMap
            result.push(object)
        })
        return result
    }
    const buildDataSelectDistrict = (inputData) => {
        let result = []
        inputData.map((item) => {
            let object = {}
            let labelVi = item.valueVi
            let labelEn = item.valueEn
            object.label = language === LANGUAGES.VI ? labelVi : labelEn
            object.value = item.id
            result.push(object)
        })
        return result
    }


    const handleChangeSelect = async (value, name) => {
        setState({
            ...state,
            [name]: value
        })
        setFormErrors({
            ...formErrors,
            [name]: ''
        })
    }

    useEffect(() => {
        fetchAllDistrict(selectedProvince)
    }, [selectedProvince])

    const fetchAllDistrict = async (selectedProvince) => {
        if (selectedProvince) {
            let res = await getDetailDistrictByProvince(selectedProvince.value)
            if (res && res.errCode === 0) {
                let data = buildDataSelectDistrict(res.data)
                setList({
                    ...list,
                    listDistrict: data
                })
            }
        }
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleOnchangeDatePicker = (date) => {
        setState({
            ...state,
            currentDate: date.getTime(),

        })
        setFormErrors({
            ...formErrors,
            currentDate: ''
        })
    }

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
    const handleSubmitConfirm = () => {
        setIsSubmit(true)
        setFormErrors(validate(state))
    }
    let formattedDate = '';
    if (dataTime && !_.isEmpty(dataTime)) {
        let dateScheduleVi, dateScheduleEn;

        dateScheduleVi = capitalizeFirstLetter(moment(+(dataTime.date)).format('dddd - DD/MM/YYYY'))



        dateScheduleEn = (moment(+(dataTime.date)).format('dddd - DD/MM/YYYY'))




        formattedDate = language === LANGUAGES.VI ? dateScheduleVi : dateScheduleEn

    }
    const [price, setPrice] = useState({})

    emitter.on('PRICE_DATA', data => {
        setPrice(data)
    })

    const bookingCare = async () => {
        setIsShowLoading(true)
        let res = await bookingCareAppointment({
            email,
            birthday: currentDate,
            firstName,
            lastName,
            phoneNumber,
            reason,
            address: `${address} , ${selectedDistrict.label} , ${selectedProvince.label}`,
            doctorId: doctorId,
            gender: selectedGender.value,
            date: +dataTime.date,
            timeType: dataTime.timeType,
            statusId: STATUS.NEW,
            role: USER_ROLE.PATIENT,
            language: language,
            formattedDate,
            labelTime: language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn,
            doctorName: language === LANGUAGES.VI ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName} ` : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName} `,
            patientName: language === LANGUAGES.VI ? ` ${firstName} ${lastName} ` : ` ${lastName} ${firstName} `,
            addressClinic: language === LANGUAGES.VI ? `${ClinicDoctor.nameVi} - ${ClinicDoctor.addressVi} ` : `${ClinicDoctor.nameEn} - ${ClinicDoctor.addressEn} `,
            price: +price.price.valueVi
        })
        if (res && res.errCode === 0) {
            setIsShowLoading(false)
            language === LANGUAGES.VI ? toast.success("Đặt lịch hẹn thành công ! Vui lòng kiểm tra email để xác nhận nhé !") : toast.success("Appointment successful! Please check your email for confirmation!")
            toggle()
        }
        if (res && res.errCode === 3) {
            setIsShowLoading(false)

            language === LANGUAGES.VI ? toast.warning("Email này đã được đặt lịch hẹn , vui lòng chọn email khác ! ") : toast.warning("This email is already scheduled , please choose another email !")
            setErrorMessageFromServer({
                valueVi: 'Email đã được đặt lịch khám bệnh !',
                valueEn: 'Email has been scheduled for medical examination!'
            })
        }
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            bookingCare()
        }
    }, [formErrors])

    return (
        <LoadingOverlay
            active={isShowLoading}
            spinner
            text='Loading your content...'
        >
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size='lg'
            >
                <div className='booking-modal-context container'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id="patient.booking.title" />
                        </span>
                        <span
                            className='right'
                            onClick={toggle}
                        >
                            <i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='row '>
                            <div className='col-12 doctor-infor'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    dataTime={dataTime}
                                    isOpenInformationSchedule={true}
                                    isOpenInformationDescription={false}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.email" />

                                </label>
                                <input type="text" className='form-control'
                                    onChange={(event) => handleOnChangeInput(event)}
                                    name='email'
                                    value={email}
                                />
                                {formErrors.email && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.email.valueVi}</span>
                                    : ''}
                                {formErrors.email && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.email.valueEn}</span>
                                    : ''}
                                {errorMessageFromServer && language === LANGUAGES.VI ?
                                    <span className='message-error'>
                                        {errorMessageFromServer.valueVi}
                                    </span> :
                                    ''}
                                {errorMessageFromServer && language === LANGUAGES.EN ?
                                    <span className='message-error'>
                                        {errorMessageFromServer.valueEn}
                                    </span> :
                                    ''}
                            </div>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.firstName" />

                                </label>
                                <input type="text" className='form-control'
                                    onChange={(event) => handleOnChangeInput(event)}
                                    name='firstName'
                                    value={firstName}
                                />
                                {formErrors.firstName && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.firstName.valueVi}</span>
                                    : ''}
                                {formErrors.firstName && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.firstName.valueEn}</span>
                                    : ''}
                            </div>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.lastName" />

                                </label>
                                <input type="text" className='form-control'
                                    onChange={(event) => handleOnChangeInput(event)}
                                    name='lastName'
                                    value={lastName}
                                />
                                {formErrors.lastName && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.lastName.valueVi}</span>
                                    : ''}
                                {formErrors.lastName && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.lastName.valueEn}</span>
                                    : ''}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.gender" />

                                </label>
                                <Select
                                    value={selectedGender}
                                    onChange={(selectedGender) => handleChangeSelect(selectedGender, 'selectedGender')}
                                    options={listGender}
                                    styles={customStyles}
                                />
                                {formErrors.selectedGender && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.selectedGender.valueVi}</span>
                                    : ''}
                                {formErrors.selectedGender && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.selectedGender.valueEn}</span>
                                    : ''}
                            </div>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.phoneNumber" />

                                </label>
                                <input type="text" className='form-control'
                                    onChange={(event) => handleOnChangeInput(event)}
                                    name='phoneNumber'
                                    value={phoneNumber}
                                />
                                {formErrors.phoneNumber && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.phoneNumber.valueVi}</span>
                                    : ''}
                                {formErrors.phoneNumber && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.phoneNumber.valueEn}</span>
                                    : ''}
                            </div>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.birthday" />

                                </label>
                                <DatePicker
                                    className='form-control'
                                    selected={currentDate}
                                    onChange={(date) => handleOnchangeDatePicker(date)}
                                    dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                                    maxDate={new Date()}
                                    placeholderText={language === LANGUAGES.VI ? 'Vui lòng chọn ngày sinh' : "Please choose birthday"}
                                />

                                {formErrors.currentDate && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.currentDate.valueVi}</span>
                                    : ''}
                                {formErrors.currentDate && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.currentDate.valueEn}</span>
                                    : ''}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.select-province" />

                                </label>
                                <Select
                                    value={selectedProvince}
                                    onChange={(selectedProvince) => handleChangeSelect(selectedProvince, 'selectedProvince')}
                                    options={listProvince}
                                    styles={customStyles}
                                />
                                {formErrors.selectedProvince && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.selectedProvince.valueVi}</span>
                                    : ''}
                                {formErrors.selectedProvince && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.selectedProvince.valueEn}</span>
                                    : ''}
                            </div>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.select-district" />

                                </label>
                                <Select
                                    value={selectedDistrict}
                                    onChange={(selectedDistrict) => handleChangeSelect(selectedDistrict, 'selectedDistrict')}
                                    options={listDistrict}
                                    styles={customStyles}
                                />
                                {formErrors.selectedDistrict && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.selectedDistrict.valueVi}</span>
                                    : ''}
                                {formErrors.selectedDistrict && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.selectedDistrict.valueEn}</span>
                                    : ''}
                            </div>
                            <div className='col-md-4 col-sm-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking.address-province" />

                                </label>
                                <input type="text" className='form-control'
                                    onChange={(event) => handleOnChangeInput(event)}
                                    name='address'
                                    value={address}
                                />
                                {formErrors.address && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.address.valueVi}</span>
                                    : ''}
                                {formErrors.address && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.address.valueEn}</span>
                                    : ''}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <label>
                                    <FormattedMessage id="patient.booking.reason" />

                                </label>
                                <input type="text" className='form-control'
                                    onChange={(event) => handleOnChangeInput(event)}
                                    name='reason'
                                    value={reason}
                                />
                                {formErrors.reason && language === LANGUAGES.VI ?
                                    <span className='message-error'>{formErrors.reason.valueVi}</span>
                                    : ''}
                                {formErrors.reason && language === LANGUAGES.EN ?
                                    <span className='message-error'>{formErrors.reason.valueEn}</span>
                                    : ''}
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer '>
                        <button className='btn-confirm'
                            onClick={() => handleSubmitConfirm()}
                        >
                            <FormattedMessage id="patient.booking.confirm" />

                        </button>
                        <button
                            className='btn-cancel'
                            onClick={toggle}
                        >
                            <FormattedMessage id="patient.booking.cancel" />

                        </button>
                    </div>
                </div>
            </Modal>
        </LoadingOverlay >
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

export default connect(mapStateToProps, mapDispatchToProps)((BookingModal));
