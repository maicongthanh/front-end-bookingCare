/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import './Doctor.scss';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LANGUAGES } from '../../../utils';

import { useHistory } from 'react-router-dom';

const Doctor = (props) => {
    const { language, settings, loadTopDoctors, doctors } = props
    const [listTopDoctor, setListTopDoctor] = useState([])
    const history = useHistory();
    useEffect(() => {
        loadTopDoctors()
    }, [])

    useEffect(() => {
        setListTopDoctor(doctors)
    }, [doctors])


    const handleViewDetailDoctor = (doctor) => {
        history.push(`/detail-doctor/${doctor.id}`)
    }
    const handleViewAllDoctor = () => {
        let path = `all-doctor`
        history.push(path)
    }

    return (
        <>
            <div className='section-share doctor'>
                <div className='container'>
                    <div className='section-content'>
                        <div className="content-up">
                            <div className="section-label">
                                <FormattedMessage id="homepage.out-standing-doctor" />
                            </div>
                            <span className='more'>
                                <button
                                    onClick={() => handleViewAllDoctor()}
                                >
                                    <FormattedMessage id="homepage.more-infor"

                                    />
                                </button>
                            </span>
                        </div>
                        <div className='content-down'>
                            <Slider {...settings}>
                                {listTopDoctor && listTopDoctor.length > 0 &&
                                    listTopDoctor.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                        }

                                        let labelVi = ` ${item.firstName} ${item.lastName} `
                                        let labelEn = ` ${item.lastName} ${item.firstName} `
                                        let specialtyName = language === LANGUAGES.VI ? item.Doctor_Infor.specialtyTypeData.nameVi : item.Doctor_Infor.specialtyTypeData.nameEn
                                        return (
                                            <div
                                                className='section-option-doctor'
                                                key={index}
                                                onClick={() => handleViewDetailDoctor(item)}
                                            >
                                                <div
                                                    className='section-image-doctor'
                                                    style={{
                                                        backgroundImage: `url(${imageBase64})`,
                                                    }}
                                                >
                                                </div>
                                                <div className='position-name-doctor'>
                                                    <span className='doctor-position mr-1'>
                                                        {language === LANGUAGES.VI ? item.positionData.valueVi : item.positionData.valueEn},
                                                    </span>
                                                    <span className='doctor-name'>
                                                        {language === LANGUAGES.VI ? labelVi : labelEn}
                                                    </span>
                                                </div>
                                                <div className='clinic-doctor'>
                                                    {specialtyName}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        doctors: state.admin.doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
