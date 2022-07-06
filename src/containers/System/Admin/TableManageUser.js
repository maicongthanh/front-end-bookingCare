/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './TableManageUser.scss'
import * as actions from '../../../store/actions'
import { toast } from 'react-toastify';
import { LANGUAGES } from '../../../utils';
import { deleteUserApi, searchUserByString } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import { useDebounce } from '../../../components/hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx/xlsx.mjs';
const TableManageUser = (props) => {

    const { fetchAllUserStart, users, language, handleEditUserFromParent, setStateDelete, handleClearErrorValidate } = props

    useEffect(() => {
        fetchAllUserStart()
    }, [])

    useEffect(() => {
        setListUser(users)
    }, [users])

    const handleDelete = async (data) => {
        let res = await deleteUserApi(data)
        if (res && res.errCode === 0) {
            language === LANGUAGES.VI ? toast.success("Xóa người dùng thành công !") : toast.success("Delete a user success !")
            fetchAllUserStart();
        }
        setStateDelete()
        handleClearErrorValidate()
    }

    const handleUpdate = (data) => {
        handleEditUserFromParent(data)
        handleClearErrorValidate()
    }



    // Phân Trang
    const [listUser, setListUser] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    let displayUsers
    const usersPerPage = 5
    const pagesVisited = pageNumber * usersPerPage
    if (listUser) {
        displayUsers = listUser
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.address}</td>
                        <td>
                            <div className='icon'>
                                <button
                                    onClick={() => handleUpdate(item)}
                                >
                                    <i className="fas fa-pencil-alt icon-pencil"></i>
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <i className="fas fa-trash icon-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            })
    }

    let pageCount
    if (listUser) {
        pageCount = Math.ceil(listUser.length / usersPerPage);
    }

    const handleOnChangePage = ({ selected }) => {
        setPageNumber(selected)
    }

    // Search

    const [searchValue, setSearchValue] = useState('')
    const debounced = useDebounce(searchValue, 800)
    const [loading, setLoading] = useState(false)

    const handleOnChangeInputSearch = (event) => {
        setSearchValue(event.target.value)
    }

    const fetchAllUserSearch = async () => {
        setLoading(true)
        let res = await searchUserByString({
            q: searchValue,
            limit: +5
        })
        if (res && res.errCode === 0) {
            setLoading(false)
            setListUser(res.data)
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (debounced) {
            fetchAllUserSearch()
        } else {
            setListUser(users)
        }
    }, [debounced])

    //Sort
    const [order, setOrder] = useState('ASC')

    const handleSorting = (col) => {
        if (order === 'ASC') {
            const sorted = [...listUser].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            )
            setListUser(sorted)
            setOrder('DSC')
        }
        if (order === 'DSC') {
            const sorted = [...listUser].sort((a, b) =>
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            )
            setListUser(sorted)
            setOrder('ASC')
        }
    }

    //Excel
    let displayUserExcel = [...listUser]
    displayUserExcel = displayUserExcel.filter(
        (data) => data.role === 'R2'
    )
    const myExportData = displayUserExcel.map((data) => {
        return {
            Email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address
        }
    })

    const handleExportToExcel = () => {
        let wb = XLSX.utils.book_new()
        let ws = XLSX.utils.json_to_sheet(myExportData);
        XLSX.utils.book_append_sheet(wb, ws, 'MySheet1')
        XLSX.writeFile(wb, 'MyExcel.xlsx')
    }

    return (
        <>
            <div className='user-container mb-5'>
                <div className='row mt-5 content-option'>
                    <div className='col-4 search'>
                        <label>
                            {language === LANGUAGES.VI ? 'Tìm kiếm tài khoản' : 'Find account by email'}
                        </label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder={language === LANGUAGES.VI ? 'Tìm kiếm theo Email' : 'Search by Email'}
                            value={searchValue}
                            onChange={(event) => handleOnChangeInputSearch(event)}
                        />
                        {loading && <FontAwesomeIcon className='spinner' icon={faSpinner} />}
                    </div>
                    <div className='col-4 excel'>
                        <button
                            className='btn btn-primary px-3'
                            onClick={handleExportToExcel}
                        >
                            Export to Excel
                        </button>
                    </div>
                </div>
                <div className='user-table mt-3 mx-1'>
                    <table id='TableManageUser'>
                        <tbody>
                            <tr>
                                <th onClick={() => handleSorting('email')}>Email</th>
                                <th onClick={() => handleSorting('firstName')}>First name</th>
                                <th onClick={() => handleSorting('lastName')}>Last name</th>
                                <th onClick={() => handleSorting('address')}>Address</th>
                                <th >Actions</th>
                            </tr>
                            {displayUsers ? displayUsers : ''}
                        </tbody>
                    </table>
                    {listUser && listUser.length > 0 &&
                        <div className="pagination mt-3">
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
                </div>

            </div>
        </>


    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserStart: () => dispatch(actions.fetchAllUserStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
