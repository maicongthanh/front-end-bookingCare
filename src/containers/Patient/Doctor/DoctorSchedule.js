/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { React, Fragment } from 'react'
import { connect } from 'react-redux';
import './DoctorSchedule.scss'
import { useEffect, useState } from 'react';
import { LANGUAGES, TODAY } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi'
import { getDetailScheduleDoctor } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
const DoctorSchedule = (props) => {

    const { language, doctorId } = props

    const [state, setState] = useState({
        allDays: [],
        listSchedule: [],
        selectedDay: ''
    })
    const { allDays, listSchedule, selectedDay } = state

    const [isRenderBookingModal, setIsRenderBookingModal] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [dataScheduleTimeModal, setDataScheduleTimeModal] = useState({})

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM')
                    let today = TODAY.valueVi + ` - ${ddMM} `
                    object.label = today
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = capitalizeFirstLetter(labelVi)
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM')
                    let today = TODAY.valueEn + ` - ${ddMM} `
                    object.label = today
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object)
        }
        setState({
            ...state,
            allDays: allDays
        })
    }, [language])

    useEffect(() => {
        getDetailSchedule()
    }, [doctorId, selectedDay, allDays])

    const getDetailSchedule = async () => {
        if (allDays && allDays.length > 0) {
            let data = selectedDay ? selectedDay : allDays[0].value
            let res = await getDetailScheduleDoctor({
                doctorId,
                date: data
            })
            if (res && res.errCode === 0) {
                setState({
                    ...state,
                    listSchedule: res.data
                })
            }
        }
    }

    const handleSelectTime = (event) => {
        setState({
            ...state,
            selectedDay: event.target.value
        })
    }

    const handleClickScheduleTime = (time) => {
        setIsRenderBookingModal(!isRenderBookingModal)
        setIsOpenModal(!isOpenModal)
        setDataScheduleTimeModal(time)
    }

    return (
        <>
            <div className='doctor-schedule-container'>
                <div className='all-schedule'>
                    <select
                        onChange={(event) => handleSelectTime(event)}
                    >
                        {allDays && allDays.length > 0 &&
                            allDays.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className='all-available-time'>
                    <div className='icon-schedule'>
                        <i className="fas fa-calendar-alt"></i>
                        <span>
                            <FormattedMessage id="patient.detail-doctor.schedule" />
                        </span>
                    </div>
                    {listSchedule && listSchedule.length > 0 ?
                        listSchedule.map((item, index) => {
                            console.log(item);
                            let timeCurrent = +(new Date()).getTime()
                            return (
                                <Fragment key={index}>
                                    <span >
                                        {+item.valueTime > +timeCurrent &&
                                            <button key={index}
                                                className={language === LANGUAGES.VI ? 'btn-schedule-vi' : 'btn-schedule-en'}
                                                onClick={() => handleClickScheduleTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}
                                            </button>
                                        }
                                    </span>
                                    {
                                        listSchedule[listSchedule.length - 1] && listSchedule[listSchedule.length - 1].valueTime < timeCurrent ?
                                            <span
                                                key={index}
                                                className={language === LANGUAGES.VI ? 'no-schedule-vi' : 'no-schedule-en'}
                                            >
                                                {language === LANGUAGES.VI ?
                                                    <FormattedMessage id="patient.detail-doctor.messageTimeOut" />
                                                    :
                                                    <FormattedMessage id="patient.detail-doctor.messageTimeOut" />
                                                }
                                            </span>
                                            : ''
                                    }
                                </Fragment>
                            )
                        })
                        :
                        <span className='no-date-schedule'>
                            <FormattedMessage id="patient.detail-doctor.messageNoSchedule" />
                        </span>
                    }
                    <div className='booking-free'>
                        <FormattedMessage id="patient.detail-doctor.booking-free-1" />
                        <i className="far fa-hand-point-up"></i>
                        <FormattedMessage id="patient.detail-doctor.booking-free-2" />
                    </div>
                </div>
            </div>
            {isRenderBookingModal &&
                <BookingModal
                    isOpenModal={isOpenModal}
                    setIsOpenModal={setIsOpenModal}
                    dataTime={dataScheduleTimeModal}
                    setIsRenderBookingModal={setIsRenderBookingModal}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
