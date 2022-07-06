/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./ModalEditUser.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from 'lodash'
const ModalEditUser = (props) => {
    const { isShowModalEdit, setIsShowModalEdit, doEditUser, currentUser } = props

    const [inputForm, setInputForm] = useState({
        id: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: ''
    })
    const { email, password, firstName, lastName, address } = inputForm

    useEffect(() => {
        if (currentUser && !_.isEmpty(currentUser)) {
            setInputForm({
                id: currentUser.id,
                email: currentUser.email,
                password: 'hardcode',
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                address: currentUser.address,
            })
        }
    }, [])

    const toggle = () => {
        setIsShowModalEdit(!isShowModalEdit);
    };


    const handleOnchangeInput = (event, id) => {
        let copyState = { ...inputForm }
        copyState[id] = event.target.value
        setInputForm({
            ...copyState
        })
    }

    const checkValidInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            if (!inputForm[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i])
                break;
            }
        }
        return isValid
    }

    const handleSaveUser = () => {
        let isValid = checkValidInput()
        if (isValid === true) {
            //Call Api edit user
            doEditUser(inputForm)
        }
    }

    return (
        <div>
            <Modal isOpen={isShowModalEdit} toggle={toggle} size="lg" >
                <ModalHeader toggle={toggle}>Edit a user</ModalHeader>
                <ModalBody>
                    <div className="container content">
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => handleOnchangeInput(event, 'email')}
                                    value={email}
                                    disabled
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(event) => handleOnchangeInput(event, 'password')}
                                    value={password}
                                    disabled
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>First name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => handleOnchangeInput(event, 'firstName')}
                                    value={firstName}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Last name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => handleOnchangeInput(event, 'lastName')}
                                    value={lastName}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => handleOnchangeInput(event, 'address')}
                                    value={address}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleSaveUser}
                        className="px-3">
                        Save changes
                    </Button>{" "}
                    <Button onClick={toggle} className="px-3">
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
