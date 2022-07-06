/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from "react-intl";
import * as actions from '../../../store/actions'
import Select from 'react-select';
import { useEffect, useState } from "react";
import { LANGUAGES, USER_ROLE } from '../../../utils/constant'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor, getDetailScheduleDoctor, deleteDetailSchedule } from "../../../services/userService";
const ManageSchedule = (props) => {

    const { listDoctorsRedux, fetchAllDoctor, language, allScheduleTime, fetchAllScheduleTime, userInfo } = props
    useEffect(() => {
        fetchAllDoctor()
        fetchAllScheduleTime()
    }, [])

    const [state, setState] = useState({
        selectedDoctor: {},
        listDoctors: [],
        currentDate: '',
        listAllTime: [],
        listSchedule: [],
        options: {}
    })

    let { selectedDoctor, listDoctors, currentDate, listAllTime, listSchedule, options } = state

    useEffect(() => {
        if (userInfo && userInfo.role === USER_ROLE.DOCTOR) {
            let info = buildDataInputSelectDetailDoctor(userInfo)
            let data = allScheduleTime
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            setState({
                ...state,
                options: info,
                listAllTime: data
            })
        }
        else {
            let dataSelect = buildDataInputSelect(listDoctorsRedux)
            let data = allScheduleTime
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            setState({
                ...state,
                listDoctors: dataSelect,
                listAllTime: data
            })
        }
    }, [listDoctorsRedux, allScheduleTime, language, userInfo])

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

    const handleChangeSelect = (selectedDoctor) => {
        setState({
            ...state,
            selectedDoctor,
        });
    };

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

    const handleOnchangeDatePicker = (date) => {
        setState({
            ...state,
            currentDate: date,
        })
    }

    const handleClickBtnTime = (time) => {
        if (listAllTime && listAllTime.length > 0) {
            let data = listAllTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            setState({
                ...state,
                listAllTime: data
            })
        }
    }
    const handleSaveSchedule = async () => {
        let result = [];
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            language === LANGUAGES.VI ? toast.error("Vui lòng chọn bác sĩ !") : toast.error("Invalid doctor !")
            return;
        }
        if (!currentDate) {
            language === LANGUAGES.VI ? toast.error("Vui lòng chọn ngày !") : toast.error("Invalid date !");
            return;
        }
        let formattedDate = currentDate.getTime()
        if (listAllTime && listAllTime.length > 0) {
            let selectedTime = listAllTime.filter(item => item.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(item => {
                    let object = {};
                    object.doctorId = selectedDoctor.value
                    object.date = +formattedDate
                    object.timeType = item.keyMap
                    object.valueTime = (+item.valueTime) + (+formattedDate)
                    result.push(object)
                })
            } else {
                language === LANGUAGES.VI ? toast.error("Vui lòng chọn  khoảng thời gian !") : toast.error("Invalid time !");
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formattedDate
        })
        if (res && res.errCode === 0) {
            language === LANGUAGES.VI ? toast.success('Tạo thời gian khám thành công') : toast.success('Create Success !')
        }
        fetchDetailScheduleDoctor()
    }
    const fetchDetailScheduleDoctor = async () => {
        let formattedDate = currentDate.getTime()
        let res = await getDetailScheduleDoctor({
            doctorId: +selectedDoctor.value,
            date: formattedDate
        })
        setState({
            ...state,
            listSchedule: res.data
        })
    }
    const handleDeleteScheduleDoctor = async (id) => {
        let res = await deleteDetailSchedule(id)
        if (res && res.errCode === 0) {
            language === LANGUAGES.VI ? toast.success('Xóa gian khám thành công') : toast.success('Delete Success !')

            fetchDetailScheduleDoctor()
        }
    }

    useEffect(() => {
        if (selectedDoctor && !_.isEmpty(selectedDoctor) && currentDate) {
            fetchDetailScheduleDoctor()
        }
    }, [selectedDoctor, currentDate])
    return (
        <div className="manage-schedule-container">
            <div className="manage-schedule-title">
                <FormattedMessage id="manage-schedule.title" />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="manage-schedule.choose-doctor" />
                        </label>
                        <Select
                            value={selectedDoctor}
                            onChange={handleChangeSelect}
                            options={userInfo && userInfo.role === 'R2' ? options : listDoctors}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="manage-schedule.choose-day" />

                        </label>
                        <DatePicker
                            className='form-control'
                            selected={currentDate}
                            onChange={(date) => handleOnchangeDatePicker(date)}
                            dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                            minDate={new Date()}
                            placeholderText={language === LANGUAGES.VI ? 'Vui lòng chọn ngày' : 'Please select a date'}
                        />
                    </div>
                    <div className="col-6 pick-hour-container">
                        {listAllTime && listAllTime.length > 0 &&
                            listAllTime.map((item, index) => {
                                return (
                                    <button
                                        className={item.isSelected === true ? "btn-schedule active" : "btn-schedule"}
                                        key={index}
                                        onClick={() => handleClickBtnTime(item)}
                                    >
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}

                                    </button>
                                )
                            })
                        }
                        <div className="col-12 btn-save">
                            <button
                                className="btn btn-primary  px-2"
                                onClick={handleSaveSchedule}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                    <div className="col-6 list-time-schedule">
                        <div className="schedule-time">
                            {language === LANGUAGES.VI ? ' Lịch khám trong ngày' : 'Checkup schedule of the day'}

                        </div>
                        <table id='TableManageSchedule'>
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Khoảng thời gian</th>
                                    <th>Actions</th>
                                </tr>
                                {listSchedule && listSchedule.length > 0 ?
                                    listSchedule.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}</td>
                                                <td>
                                                    <div className='icon'>
                                                        <button
                                                            onClick={() => handleDeleteScheduleDoctor(item.id)}
                                                        >
                                                            <i className="fas fa-trash icon-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td></td>
                                        <td>{language === LANGUAGES.VI ? 'Không có dữ liệu' : 'No data'}</td>
                                        <td></td>
                                    </tr>
                                }

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        listDoctorsRedux: state.admin.listDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
