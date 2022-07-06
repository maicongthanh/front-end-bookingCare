/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import './ProfileDoctor.scss'
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { getProfileDoctorById } from '../../../services/userService'
import { memo, useEffect, useState } from 'react';
import { LANGUAGES } from '../../../utils/constant'
import _ from 'lodash';
import moment from 'moment';
import localization from 'moment/locale/vi'
import { useHistory } from 'react-router';
import { emitter } from '../../../utils/emitter';
const ProfileDoctor = (props) => {
    console.log('abc');
    const history = useHistory()
    const { language, doctorId, dataTime, isOpenInformationSchedule, isOpenInformationDescription, isOpenShowSpecialty } = props
    const [profileDoctor, setProfileDoctor] = useState({})

    useEffect(() => {
        fetchProfileDoctor(doctorId)
    }, [doctorId])

    const fetchProfileDoctor = async (doctorId) => {
        let res = await getProfileDoctorById(doctorId)
        setProfileDoctor(res.data)
    }
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let imageBase64, nameDoctorVi, nameDoctorEn, nameDoctor, timeSchedule, dateScheduleVi, dateScheduleEn, dataSchedule, price, nameClinic, addressClinic, location, nameSpecialty;
    if (profileDoctor && !_.isEmpty(profileDoctor)) {
        imageBase64 = profileDoctor.image
        nameDoctorVi = ` ${profileDoctor.positionData.valueVi} , ${profileDoctor.firstName} ${profileDoctor.lastName}`
        nameDoctorEn = ` ${profileDoctor.positionData.valueEn} , ${profileDoctor.lastName} ${profileDoctor.firstName}`
        nameDoctor = language === LANGUAGES.VI ? nameDoctorVi : nameDoctorEn
        price = language === LANGUAGES.VI ? profileDoctor.Doctor_Infor.priceTypeData.valueVi : profileDoctor.Doctor_Infor.priceTypeData.valueEn
        nameClinic = language === LANGUAGES.VI ? profileDoctor.Doctor_Infor.clinicTypeData.nameVi : profileDoctor.Doctor_Infor.clinicTypeData.nameEn
        addressClinic = language === LANGUAGES.VI ? profileDoctor.Doctor_Infor.clinicTypeData.addressVi : profileDoctor.Doctor_Infor.clinicTypeData.addressEn
        location = language === LANGUAGES.VI ? profileDoctor.Doctor_Infor.provinceTypeData.valueVi : profileDoctor.Doctor_Infor.provinceTypeData.valueEn
        nameSpecialty = language === LANGUAGES.VI ? profileDoctor.Doctor_Infor.specialtyTypeData.nameVi : profileDoctor.Doctor_Infor.specialtyTypeData.nameEn
        emitter.emit('PRICE_DATA', { 'price': profileDoctor.Doctor_Infor.priceTypeData })
    }
    if (dataTime && !_.isEmpty(dataTime)) {
        timeSchedule = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
        dateScheduleVi = capitalizeFirstLetter(moment(+(dataTime.date)).format('dddd - DD/MM/YYYY'))
        dateScheduleEn = (moment(+(dataTime.date)).locale('en').format('dddd - DD/MM/YYYY'))
        dataSchedule = language === LANGUAGES.VI ? dateScheduleVi : dateScheduleEn
    }

    const handleViewDetailDoctor = (doctorId) => {
        if (doctorId) {
            history.push(`/detail-doctor/${doctorId}`)
        }
    }

    return (
        <div className='profile-doctor-container'>
            <div className='profile-content'>
                <div className="left">
                    <div
                        className={isOpenInformationDescription === true ? 'avatar-doctor-detail' : 'avatar-doctor'}
                        style={{
                            backgroundImage: `url(${imageBase64})`,
                        }}
                        onClick={isOpenInformationDescription === true ? () => handleViewDetailDoctor(doctorId) : () => { }}
                    >
                    </div>
                    {isOpenInformationDescription === true ?
                        <span className="more-detail-doctor"
                            onClick={() => handleViewDetailDoctor(doctorId)}
                        >
                            <FormattedMessage id='patient.booking.more-information' />
                        </span>
                        : ''
                    }
                </div>

                <div className='infor-doctor'>
                    <span
                        className={isOpenInformationDescription === true ? 'name-doctor-detail' : 'name-doctor'}
                        onClick={isOpenInformationDescription === true ? () => handleViewDetailDoctor(doctorId) : () => { }}
                    >
                        {nameDoctor}
                    </span>
                    {isOpenShowSpecialty === true &&
                        <span className='name-specialty'>
                            {nameSpecialty}
                        </span>
                    }
                    {isOpenInformationSchedule === true &&
                        <div className='time-schedule'>
                            <div className='row'>
                                <div className='content-left'>
                                    <span
                                        className='name-clinic'
                                    >
                                        . {nameClinic}
                                    </span>
                                    <span className='address-clinic'>
                                        <FormattedMessage id='patient.booking.address' /> {addressClinic}
                                    </span>
                                </div>
                                <div className='content-right'>
                                    <span className='time'>
                                        <FormattedMessage id='patient.booking.time' /> {timeSchedule}
                                    </span>
                                    <span className='date'>
                                        <FormattedMessage id='patient.booking.date' /> {dataSchedule}
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                    {isOpenInformationDescription === true &&
                        <>
                            <div className='description'>
                                {profileDoctor && profileDoctor.Markdown ?
                                    language === LANGUAGES.VI ? profileDoctor.Markdown.descriptionVi :
                                        profileDoctor.Markdown.descriptionEn
                                    : ''
                                }
                            </div>
                            <div className='location'>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>

                                    {location}
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div>
            {isOpenInformationSchedule === true ?
                <div className='price'>
                    <span className='mr-1'>
                        <FormattedMessage id='patient.booking.price' />
                    </span>
                    <span>
                        < NumberFormat
                            value={price}
                            displayType={'text'}
                            thousandSeparator={true} suffix={language === LANGUAGES.VI ? ' VND. ' : ' $. '}
                        />
                    </span>
                </div>
                :
                ''
            }
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

export default connect(mapStateToProps, mapDispatchToProps)((ProfileDoctor));
