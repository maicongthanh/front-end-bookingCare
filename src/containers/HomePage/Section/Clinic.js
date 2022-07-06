import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './Clinic.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllClinic } from '../../../services/clinicService';
import { LANGUAGES } from '../../../utils/constant';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
const Clinic = (props) => {
    const { language, settings } = props
    const history = useHistory()
    const [listClinic, setListClinic] = useState([])

    useEffect(() => {
        const fetchAllClinic = async () => {
            let res = await getAllClinic('TYPE1')
            if (res && res.errCode === 0) {
                setListClinic(res.data)
            }
        }
        fetchAllClinic()
    }, [])

    const handleViewDetailClinic = (item) => {
        history.push(`/detail-clinic/${item.id}`)
    }

    const handleViewAllClinic = () => {
        history.push('/all-clinic')
    }

    return (
        <div className='section-share clinic'>
            <div className='container'>
                <div className='section-content'>
                    <div className="content-up">
                        <div className="section-label">
                            <FormattedMessage id="patient.clinic.outstanding-clinic" />
                        </div>
                        <span className='more'>
                            <button
                                onClick={() => handleViewAllClinic()}
                            >
                                <FormattedMessage id="patient.clinic.more" />
                            </button>
                        </span>
                    </div>
                    <div className='content-down'>
                        <Slider {...settings}>
                            {listClinic && listClinic.length > 0 &&
                                listClinic.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.background) {
                                        imageBase64 = Buffer.from(item.background, 'base64').toString('binary');
                                    }
                                    return (
                                        <div className='section-option' key={index}
                                            onClick={() => handleViewDetailClinic(item)}
                                        >
                                            <div className='section-image'
                                                style={{
                                                    backgroundImage: `url(${imageBase64})`
                                                }}
                                            >
                                            </div>
                                            <p>
                                                {language === LANGUAGES.VI ? item.nameVi : item.nameEn}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Clinic);
