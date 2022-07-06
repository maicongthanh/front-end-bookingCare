import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss'
import { getAllUsers, createNewUserService, deleteUserApi, editUserApi } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

const UserManage = () => {
    const [arrUsers, setArrUsers] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    const [isShowModalEdit, setIsShowModalEdit] = useState(false)
    const [userEdit, setUserEdit] = useState({})

    useEffect(() => {
        getAllUsersApi()
    }, [])

    const getAllUsersApi = async () => {
        let response = await getAllUsers('ALL')
        if (response && response.errCode === 0) {
            setArrUsers(response.users)
        }
    }

    const handleAddNewUser = () => {
        setIsShowModal(!isShowModal)
    }


    const createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data)
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                getAllUsersApi()
                setIsShowModal(false)
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleDeleteUser = async (id) => {
        try {
            let response = await deleteUserApi(id)
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
                setIsShowModal(false)
            } else {
                alert(response.errMessage)
                getAllUsersApi()
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleEditUser = (item) => {
        setIsShowModalEdit(!isShowModalEdit)
        setUserEdit(item)
    }

    const doEditUser = async (user) => {
        try {
            let response = await editUserApi(user)
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                alert(response.errMessage)
                getAllUsersApi()
                setIsShowModalEdit(false)
            }
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <div className='user-container'>

            <ModalUser
                isShowModal={isShowModal}
                setIsShowModal={setIsShowModal}
                createNewUser={createNewUser}
            />

            {isShowModalEdit &&
                <ModalEditUser

                    isShowModalEdit={isShowModalEdit}
                    setIsShowModalEdit={setIsShowModalEdit}
                    currentUser={userEdit}
                    doEditUser={doEditUser}
                />
            }
            <div className='title'>Manage users</div>
            <div className='mx-1'>
                <button
                    className='btn btn-primary px-2' onClick={() => handleAddNewUser()}>
                    Add new user
                </button>
            </div>
            <div className='user-table mt-3 mx-1'>
                <table id="customers">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        {arrUsers && arrUsers.length > 0 &&
                            arrUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <div className='icon'>
                                                <button
                                                    onClick={() => handleEditUser(item)}
                                                >
                                                    <i className="fas fa-pencil-alt icon-pencil"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(item.id)}>
                                                    <i className="fas fa-trash icon-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}


const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
