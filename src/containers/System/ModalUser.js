import React, { useState } from "react";
import { connect } from "react-redux";
import "./ModalUser.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";

const ModalUser = (props) => {
    const { isShowModal, setIsShowModal, createNewUser } = props

    const toggle = () => {
        setIsShowModal(!isShowModal);
    };

    const [inputForm, setInputForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: ''
    })
    const { email, password, firstName, lastName, address } = inputForm

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

    const handleAddNewUser = () => {
        let isValid = checkValidInput()
        if (isValid === true) {
            createNewUser(inputForm)
        }
    }

    (() => {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            setInputForm({})
        })
    })()
    return (
        <div>
            <Modal isOpen={isShowModal} toggle={toggle} size="lg" >
                <ModalHeader toggle={toggle}>Create a new user</ModalHeader>
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
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(event) => handleOnchangeInput(event, 'password')}
                                    value={password}

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
                        onClick={handleAddNewUser}
                        className="px-3">
                        Add new
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
