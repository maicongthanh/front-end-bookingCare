/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from "react-redux";
import './ManagePatient.scss'
import Select from 'react-select';
import DatePicker from "react-datepicker";
import * as actions from '../../../store/actions'
import "react-datepicker/dist/react-datepicker.css";
import { LANGUAGES, USER_ROLE, STATUS } from "../../../utils/constant";
import { useEffect, useState } from "react";
import _ from "lodash";
import { getAllAppointmentOfDoctor } from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { sendRemedyService } from "../../../services/userService";
import { toast } from "react-toastify";
import { emitter } from "../../../utils/emitter";

import LoadingOverlay from 'react-loading-overlay';

import { FormattedMessage } from "react-intl";
const ManagePatient = (props) => {

    const { language, userInfo, fetchAllDoctor, listDoctorsRedux } = props
    const [currentDate, setCurrentDate] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [options, setOptions] = useState([])
    const [listAppointment, setListAppointment] = useState([])
    const [newList, setNewList] = useState([])
    const [isOpenRemedy, setIsOpenRemedy] = useState(false)
    const [dataModal, setDataModal] = useState({})
    const [isShowLoading, setIsShowLoading] = useState(false)

    useEffect(() => {
        fetchAllDoctor()
    }, [])

    useEffect(() => {
        if (userInfo && userInfo.role === USER_ROLE.DOCTOR) {
            let info = buildDataInputSelectDetailDoctor(userInfo)
            if (info && info.length > 0) {
                setOptions(info)
            }
        } else {
            let data = buildDataInputSelect(listDoctorsRedux)
            if (data && data.length > 0) {
                setOptions(data)
            }
        }

    }, [language, userInfo, listDoctorsRedux])

    const handleOnchangeDatePicker = (date) => {
        setCurrentDate(date)
        setNewList([])
    }

    const handleChangeSelect = (selectedDoctor) => {
        setSelectedDoctor(selectedDoctor)

    }

    const fetchDetailScheduleDoctor = async () => {
        let formattedDate = currentDate.getTime()
        let res = await getAllAppointmentOfDoctor({
            doctorId: +selectedDoctor.value,
            date: +formattedDate,
            statusId: STATUS.CONFIRM
        })
        if (res && res.errCode === 0) {
            setListAppointment(res.data)
        }
    }

    useEffect(() => {
        if (selectedDoctor && !_.isEmpty(selectedDoctor) && currentDate) {
            fetchDetailScheduleDoctor()
        }
    }, [selectedDoctor, currentDate])

    const buildDataInputSelectDetailDoctor = (userInfo) => {
        if (userInfo && !_.isEmpty(userInfo)) {
            let result = [];
            let object = {};
            let labelVi = `${userInfo.firstName} ${userInfo.lastName}`
            let labelEn = `${userInfo.lastName} ${userInfo.firstName}`
            object.label = language === LANGUAGES.VI ? labelVi : labelEn
            object.value = userInfo.id
            result.push(object)
            return result;
        }
    }

    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.firstName} ${item.lastName}`
                let labelEn = `${item.lastName} ${item.firstName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
        return result;
    }

    const groupBy = (array, key) => {
        let label = ''
        return array.reduce((result, currentValue) => {
            if (currentValue) {
                label = language === LANGUAGES.VI ? currentValue.timeTypeDataPatient.valueVi : currentValue.timeTypeDataPatient.valueEn
            }
            (result[label] = result[label] || []).push(currentValue);
            return result;
        }, {});
    };

    useEffect(() => {
        if (listAppointment) {
            const personGroupedByColor = groupBy(listAppointment);
            let data = Object.entries(personGroupedByColor)
            if (data) {
                setNewList(data)
            }
        }
    }, [listAppointment, language])

    const handleConfirm = (item1) => {
        console.log(item1);
        console.log(item1.doctorTypeData.firstName);
        console.log(item1.doctorTypeData.LastName);

        let timeVi = `${item1.timeTypeDataPatient.valueVi}`
        let timeEn = `${item1.timeTypeDataPatient.valueEn}`
        let dateVi = moment(+item1.date).format('DD/MM/YYYY')
        let dateEn = moment(+item1.date).format('MM/DD/YYYY')
        let data = {
            doctorId: item1.doctorId,
            email: item1.email,
            patientId: item1.id,
            timeType: item1.timeType,
            date: item1.date,
            language,
            timeVi,
            timeEn,
            dateVi,
            dateEn,
            firstNameDoctor: item1.doctorTypeData.firstName,
            lastNameDoctor: item1.doctorTypeData.lastName,
            firstName: item1.firstName,
            lastName: item1.lastName
        }
        setIsOpenRemedy(!isOpenRemedy)
        setDataModal(data)
    }

    const handleCloseModal = () => {
        setIsOpenRemedy(!isOpenRemedy)
    }

    const sendRemedy = async (dataChildModal) => {
        setIsShowLoading(true)
        let res = await sendRemedyService({
            email: dataChildModal.email,
            imageBase64: dataChildModal.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            date: +dataModal.date,
            language,
            timeDate: language === LANGUAGES.VI ? `${dataModal.timeVi} ${dataModal.dateVi} ` : `${dataModal.timeEn} ${dataModal.dateEn} `,
            doctorName: language === LANGUAGES.VI ? `${dataModal.firstNameDoctor} ${dataModal.lastNameDoctor}` : `${dataModal.lastNameDoctor} ${dataModal.firstNameDoctor}`,
            patientName: language === LANGUAGES.VI ? `${dataModal.firstName} ${dataModal.lastName}` : `${dataModal.lastName} ${dataModal.firstName}`,
        })
        if (res && res.errCode === 0) {
            setIsShowLoading(false)
            fetchDetailScheduleDoctor()
            setIsOpenRemedy(!isOpenRemedy)
            emitter.emit('EVENT_CLEAR_MODAL_DATA')
            language === LANGUAGES.VI ? toast.success('Gửi hóa đơn thành công !') : toast.success('Send Remedy Success !')
        } else {
            setIsShowLoading(false)

            language === LANGUAGES.VI ? toast.error('Gửi hóa đơn không thành công , vui lòng kiểm tra lại !') : toast.success('Send Remedy failed , please check again !')

        }
    }

    return (
        <>
            <LoadingOverlay
                active={isShowLoading}
                spinner
                text='Loading your content...'
            >
                <div className="manage-patient-container container">
                    <div className="manage-patient-title">
                        <FormattedMessage id='admin.manage-list-patient.title' />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>
                                <FormattedMessage id='admin.manage-list-patient.choose-doctor' />
                            </label>
                            <Select
                                value={selectedDoctor}
                                onChange={handleChangeSelect}
                                options={options}
                            />
                        </div>
                        <div className="col-6">
                            <label>
                                <FormattedMessage id='admin.manage-list-patient.choose-day' />
                            </label>
                            <DatePicker
                                className='form-control'
                                selected={currentDate}
                                onChange={(date) => handleOnchangeDatePicker(date)}
                                dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                                placeholderText='Vui lòng chọn ngày'
                                minDate={new Date()}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-bordered mt-3">
                                <thead className="thead-custom">
                                    <tr>
                                        <td>
                                            <FormattedMessage id='admin.manage-list-patient.time' />
                                        </td>
                                        <tr>
                                            <td>
                                                <FormattedMessage id='admin.manage-list-patient.fullName' />
                                            </td>
                                            <td>
                                                <FormattedMessage id='admin.manage-list-patient.birthday' />

                                            </td>
                                            <td>
                                                <FormattedMessage id='admin.manage-list-patient.gender' />

                                            </td>
                                            <td>
                                                <FormattedMessage id='admin.manage-list-patient.address' />
                                            </td>
                                            <td>
                                                <FormattedMessage id='admin.manage-list-patient.phoneNumber' />

                                            </td>
                                            <td>
                                                <FormattedMessage id='admin.manage-list-patient.reason' />

                                            </td>
                                            <td>
                                                Action
                                            </td>
                                        </tr>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newList && newList.length > 0 ?
                                        newList.reverse().map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th>{item[0]}</th>
                                                    {item[1].reverse().map((item1, index) => {
                                                        let fullName = language === LANGUAGES.VI ? `${item1.firstName} ${item1.lastName} ` : `${item1.lastName} ${item1.firstName} `
                                                        let gender = language === LANGUAGES.VI ? item1.genderDataPatient.valueVi : item1.genderDataPatient.valueEn
                                                        let address = item1.address
                                                        let phoneNumber = item1.phoneNumber
                                                        let reason = item1.reason
                                                        let birthday = language === LANGUAGES.VI ? moment(+item1.birthday).format('DD/MM/YYYY') : moment(+item1.birthday).format('MM/DD/YYYY')
                                                        return (
                                                            <tr key={index}>
                                                                <td>{fullName}</td>
                                                                <td>{birthday}</td>
                                                                <td>{gender}</td>
                                                                <td>{address}</td>
                                                                <td>{phoneNumber}</td>
                                                                <td>{reason}</td>
                                                                <td >
                                                                    <button
                                                                        className="btn-confirm"
                                                                        onClick={() => handleConfirm(item1)}
                                                                    >
                                                                        {language === LANGUAGES.VI ? 'Đã khám xong' : 'Finished examination'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td>
                                                {language === LANGUAGES.VI ? 'Không có lịch hẹn' : 'No appointment'}
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <RemedyModal
                    isOpenRemedy={isOpenRemedy}
                    dataModal={dataModal}
                    handleCloseModal={handleCloseModal}
                    sendRemedy={sendRemedy}
                />
            </LoadingOverlay>
        </>
    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        listDoctorsRedux: state.admin.listDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
