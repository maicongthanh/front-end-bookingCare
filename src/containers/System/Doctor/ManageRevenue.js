/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from "react-redux";
import './ManageRevenue.scss'
import Select from 'react-select';
import * as actions from '../../../store/actions'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { LANGUAGES, STATUS, USER_ROLE } from "../../../utils";
import _ from "lodash";
import { getAllBillOfDoctor, getAllBillWithWeekMonthOfDoctor } from "../../../services/userService";
import NumberFormat from "react-number-format";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";

import { FormattedMessage } from 'react-intl';
const ManageRevenue = (props) => {

    const { language, userInfo, listDoctorsRedux, fetchAllDoctor } = props
    const [isOpenSortWeekMonth, setIsOpenSortWeekMonth] = useState(false)
    const [options, setOptions] = useState([])
    const [state, setState] = useState({
        selectedDay: '',
        selectedDayMonth: '',
        selectedWeekMonthYear: '',
        selectedDoctor: ''
    })
    const { selectedDay, selectedDayMonth, selectedWeekMonthYear, selectedDoctor } = state

    const [listBill, setListBill] = useState([])
    const [pageNumber, setPageNumber] = useState(0)

    let displayUsers = ''
    const usersPerPage = 5
    const pagesVisited = pageNumber * usersPerPage
    if (listBill && listBill.length > 0) {
        displayUsers = listBill
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.firstName} {item.lastName}</td>
                        <td>{item.genderDataPatient.valueVi}</td>
                        <td>{item.address}</td>
                        <td>{item.phoneNumber}</td>
                        <td >
                            <button
                                className="btn-confirm"
                            >
                                Xem chi tiết
                            </button>
                        </td>
                    </tr>
                )

            })
    }

    let pageCount
    if (listBill && listBill.length > 0) {
        pageCount = Math.ceil(listBill.length / usersPerPage);
    }

    const handleOnChangePage = ({ selected }) => {
        setPageNumber(selected)
    }

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

    const handleOnchangeDatePicker = (date, name) => {
        let formattedDay = date.getTime()
        setState({
            ...state,
            [name]: formattedDay
        })
    }

    const handleChangeSelect = (selectedDoctor) => {
        setState({
            ...state,
            selectedDoctor
        })
    }

    const fetchAllBill = async () => {
        let res = await getAllBillOfDoctor({
            doctorId: selectedDoctor.value,
            date: selectedDay,
            statusId: STATUS.DONE
        })
        if (res && res.errCode === 0) {
            setListBill(res.data)
        }
    }

    useEffect(() => {
        if (selectedDoctor && !_.isEmpty(selectedDoctor) && selectedDay) {
            fetchAllBill()
        }
    }, [selectedDoctor, selectedDay])

    let result = ''
    if (listBill && listBill.length > 0) {
        result = listBill.reduce((total, currentValue) => {
            return total + (+currentValue.price)
        }, 0)
    }

    const handleSortWeekMonth = async () => {
        if (!selectedDayMonth || !selectedWeekMonthYear || !selectedDoctor) {
            language === LANGUAGES.VI ? toast.error('Vui lòng điền đầy đủ thông tin !') : toast.error('Please complete all information !')
        }
        if (+selectedWeekMonthYear < selectedDayMonth) {
            language === LANGUAGES.VI ? toast.error('Vui lòng chọn ngày sau lớn lơn ngày trước !') : toast.error('Please choose the next day bigger than the previous day !')
        }
        if (selectedDayMonth && selectedWeekMonthYear && selectedDayMonth < selectedWeekMonthYear && selectedDoctor) {
            let res = await getAllBillWithWeekMonthOfDoctor({
                doctorId: selectedDoctor.value,
                statusId: STATUS.DONE,
                dateDay: selectedDayMonth,
                dateOfWeekMonth: selectedWeekMonthYear
            })
            if (res && res.errCode === 0) {
                setListBill(res.data)
            }
        }
    }

    const handleOnChangeRevenue = () => {
        setIsOpenSortWeekMonth(!isOpenSortWeekMonth)
        setListBill([])
    }


    return (
        <div className="manage-revenue-container container">
            <div className="manage-revenue-title">
                <FormattedMessage id='admin.manage-revenue.title' />
            </div>
            <div className="row">
                <div className="col-5">
                    <label className="mb-4">
                        <FormattedMessage id='admin.manage-revenue.choose-doctor' />
                    </label>
                    <Select
                        value={selectedDoctor}
                        onChange={handleChangeSelect}
                        options={options}
                    />
                </div>
                <div className="col-7">
                    <div className="select-option">
                        <span>
                            <FormattedMessage id='admin.manage-revenue.title2' />

                        </span>
                        <button
                            className={isOpenSortWeekMonth === false ? "btn-revenue active" : 'btn-revenue'}
                            onClick={() => handleOnChangeRevenue()}
                        >
                            <FormattedMessage id='admin.manage-revenue.day' />

                        </button>
                        <button
                            className={isOpenSortWeekMonth === true ? "btn-revenue active " : 'btn-revenue '}
                            onClick={() => handleOnChangeRevenue()}
                        >
                            <FormattedMessage id='admin.manage-revenue.all-day' />

                        </button>
                    </div>
                    <div className="date-picker">
                        {isOpenSortWeekMonth === false &&
                            <div className="day-date-picker">
                                <DatePicker
                                    className="form-control"
                                    selected={selectedDay}
                                    onChange={(date) => handleOnchangeDatePicker(date, 'selectedDay')}
                                    dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                                    placeholderText={language === LANGUAGES.VI ? 'Vui lòng chọn ngày' : 'Please choose day'}
                                    name='selectedDay'
                                />
                            </div>
                        }
                        {isOpenSortWeekMonth === true &&
                            <>
                                <div className="day-date-picker">
                                    <span>
                                        {language === LANGUAGES.VI ? 'Từ' : 'From'}
                                    </span>
                                    <DatePicker
                                        className="form-control"
                                        selected={selectedDayMonth}
                                        onChange={(date) => handleOnchangeDatePicker(date, 'selectedDayMonth')}
                                        dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                                        placeholderText={language === LANGUAGES.VI ? 'Vui lòng chọn ngày' : 'Please choose day'}
                                        name='selectedDayMonth'
                                    />
                                </div>
                                <div className="week-month-date-picker">
                                    <span>Đến</span>
                                    <DatePicker
                                        selected={selectedWeekMonthYear}
                                        onChange={(date) => handleOnchangeDatePicker(date, 'selectedWeekMonthYear')}
                                        dateFormat={language === LANGUAGES.VI ? "dd/MM/yyyy" : "MM/dd/yyyy"}
                                        className="form-control"
                                        name='selectedWeekMonthYear'
                                        placeholderText={language === LANGUAGES.VI ? 'Vui lòng chọn ngày' : 'Please choose day'}

                                    />
                                </div>
                                <span
                                    className="btn-search"
                                    onClick={handleSortWeekMonth}
                                >
                                    {language === LANGUAGES.VI ? 'Tìm kiếm ' : 'Find'}
                                </span>
                            </>
                        }
                    </div>


                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table className="table table-bordered mt-3">
                        <thead className="thead-custom">
                            <tr>
                                <td>
                                    <FormattedMessage id='admin.manage-revenue.fullName' />

                                </td>
                                <td>
                                    <FormattedMessage id='admin.manage-revenue.gender' />

                                </td>
                                <td>
                                    <FormattedMessage id='admin.manage-revenue.address' />

                                </td>
                                <td>
                                    <FormattedMessage id='admin.manage-revenue.phoneNumber' />
                                </td>
                                <td>
                                    Action
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {displayUsers ? displayUsers : ''}
                        </tbody>
                    </table>
                    {listBill && listBill.length > 0 &&
                        <div className="pagination">
                            <ReactPaginate
                                previousLabel="<"
                                nextLabel='>'
                                pageCount={pageCount}
                                onPageChange={handleOnChangePage}
                                containerClassName={'paginationBttns'}
                                previousLinkClassName={'previousBttn'}
                                nextLinkClassName={'nextBttn'}
                                disabledClassName={'paginationDisabled'}
                                activeClassName={'paginationActive'}
                            />
                        </div>
                    }
                    <div>
                        <FormattedMessage id='admin.manage-revenue.total' />
                        <span className="ml-1">
                            < NumberFormat
                                value={result ? result : 0}
                                displayType={'text'}
                                thousandSeparator={true} suffix={' VND .'}
                            />
                        </span>

                    </div>
                </div>
            </div>
        </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageRevenue);
