/* eslint-disable react-hooks/exhaustive-deps */
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import "./Profile.scss";
import ChangePassword from "./ChangePassword";
import moment from "moment";
const Profile = (props) => {

    const { userInfo, language } = props

    const [isOpenChangePassWord, setIsOpenChangePassWord] = useState(false)

    let email, firstName, lastName, birthday, genderVi, genderEn, address, phoneNumber,
        positionVi, positionEn, roleVi, roleEn, clinicVi, clinicEn, specialtyVi, specialtyEn, imageBase64
    if (userInfo && userInfo.Doctor_Infor) {
        email = userInfo.email
        firstName = userInfo.firstName
        lastName = userInfo.lastName
        genderVi = userInfo.genderData.valueVi
        genderEn = userInfo.genderData.valueEn
        address = userInfo.address
        phoneNumber = userInfo.phoneNumber
        positionVi = userInfo.positionData.valueVi
        positionEn = userInfo.positionData.valueEn
        roleVi = userInfo.roleData.valueVi
        roleEn = userInfo.roleData.valueEn
        specialtyVi = userInfo.Doctor_Infor.specialtyTypeData.nameVi
        specialtyEn = userInfo.Doctor_Infor.specialtyTypeData.nameEn
        clinicVi = userInfo.Doctor_Infor.clinicTypeData.nameVi
        clinicEn = userInfo.Doctor_Infor.clinicTypeData.nameEn
        imageBase64 = Buffer.from(userInfo.image, 'base64').toString('binary');
        birthday = moment(+userInfo.birthday).format('DD/MM/YYYY')
    }

    const handleIsOpenChangePassword = () => {
        setIsOpenChangePassWord(!isOpenChangePassWord)
    }

    return (
        <div className="profile-container container">
            <div className="row">
                <div className="col-md-3">
                    <div className="content-left">
                        <div
                            className="image"
                            style={{
                                backgroundImage:
                                    `url(${imageBase64})`
                            }}
                        >

                        </div>
                        <span className="mt-3">
                            {email}
                        </span>
                    </div>
                    <hr />
                    <div className="options">
                        <span onClick={handleIsOpenChangePassword}
                        >
                            ?????i m???t kh???u
                        </span>
                        {isOpenChangePassWord === true &&
                            <ChangePassword
                                email={email}
                                setIsOpenChangePassWord={setIsOpenChangePassWord}
                                isOpenOptionChangePassword={true}
                            />
                        }
                    </div>
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col-md-6 content-center information-left">
                            <div className="p-3 py-3 left">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Th??ng tin t??i kho???n</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <label className="labels">H???</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={firstName}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">T??n</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={lastName}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">Ng??y sinh</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={birthday}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">Gi???i t??nh</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={language === LANGUAGES.VI
                                                ?
                                                genderVi
                                                :
                                                genderEn}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">?????a ch??? li??n h???</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={address}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">Email</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={email}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">S??? ??i???n tho???i</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={phoneNumber}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 content-center information-left">
                            <div className="p-3 py-3 left">

                                <div className="row mt-5">
                                    <div className="col-md-6">
                                        <label className="labels">Vai tr??</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={language === LANGUAGES.VI
                                                ?
                                                roleVi
                                                :
                                                roleEn}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Ch???c v???</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={language === LANGUAGES.VI
                                                ?
                                                positionVi
                                                :
                                                positionEn
                                            }
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">C?? s??? y t???</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={language === LANGUAGES.VI
                                                ?
                                                clinicVi
                                                :
                                                clinicEn
                                            }
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <label className="labels">Chuy??n khoa</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={language === LANGUAGES.VI
                                                ?
                                                specialtyVi
                                                :
                                                specialtyEn
                                            }
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);