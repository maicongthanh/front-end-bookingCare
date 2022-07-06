import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import * as actions from '../../store/actions'
import './Specialty.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllSpecialty } from '../../../services/specialtyService';
import { LANGUAGES } from '../../../utils/constant';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
const Specialty = (props) => {
    const { language, settings } = props
    const history = useHistory()
    const [listSpecialty, setListSpecialty] = useState([])
    useEffect(() => {
        const fetchAllSpecialty = async () => {
            let res = await getAllSpecialty('TYPE1')
            if (res && res.errCode === 0) {
                setListSpecialty(res.data)
            }
        }
        fetchAllSpecialty()
    }, [])

    const handleViewDetailSpecialty = (item) => {
        history.push(`/detail-specialty/${item.id}`)
    }

    const handleViewAllSpecialty = () => {
        history.push('/all-specialty')
    }
    return (
        <div className='section-share specialty'>
            <div className='container'>
                <div className='section-content'>
                    <div className="content-up">
                        <div className="section-label">
                            <FormattedMessage id="patient.specialty.popular-specialties" />
                        </div>
                        <span className='more'>
                            <button
                                onClick={() => handleViewAllSpecialty()}
                            >
                                <FormattedMessage id="patient.specialty.more" />
                            </button>
                        </span>
                    </div>
                    <div className='content-down'>
                        <Slider {...settings}>
                            {listSpecialty && listSpecialty.length > 0 &&
                                listSpecialty.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div className='section-option' key={index}
                                            onClick={() => handleViewDetailSpecialty(item)}
                                        >
                                            <div className='section-image'
                                                style={{
                                                    backgroundImage: `url(${imageBase64})`,
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
