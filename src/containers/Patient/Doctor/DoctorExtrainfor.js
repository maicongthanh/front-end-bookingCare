import { connect } from 'react-redux';
import './DoctorExtrainfor.scss'
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { detailDoctorClinicSpecialty } from '../../../services/userService';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
const DoctorExtrainfor = (props) => {

    const { language, doctorId } = props
    const [isShow, setIsShow] = useState(false)
    const [doctorExtra, setDoctorExtra] = useState({})

    useEffect(() => {
        fetchExtraInforDoctor(doctorId)
    }, [doctorId])

    const fetchExtraInforDoctor = async (doctorId) => {
        if (doctorId) {
            let res = await detailDoctorClinicSpecialty(doctorId)
            if (res && res.errCode === 0) {
                setDoctorExtra(res.data)
            }
        }
    }

    return (
        <div className='doctor-extra-infor-container'>
            <div className='content-up'>
                <div className='clinic-title'>
                    <FormattedMessage id="patient.extra-doctor.text-address" />
                </div>
                <span className='name-clinic'>
                    {doctorExtra && !_.isEmpty(doctorExtra) ?
                        language === LANGUAGES.VI ?
                            doctorExtra.clinicTypeData?.nameVi
                            :
                            doctorExtra.clinicTypeData?.nameEn
                        : ''
                    }
                </span>

                <span className='address-clinic'>
                    {doctorExtra && !_.isEmpty(doctorExtra) ?
                        language === LANGUAGES.VI ?
                            doctorExtra.clinicTypeData?.addressVi
                            :
                            doctorExtra.clinicTypeData?.addressEn
                        : ''
                    }
                </span>
            </div>
            <div className='content-down'>
                <div className='body-top'>
                    <span className='price-title'>
                        <FormattedMessage id="patient.extra-doctor.price" />
                    </span>
                    {isShow === false &&
                        <span className='price'>
                            {doctorExtra && !_.isEmpty(doctorExtra) &&
                                < NumberFormat
                                    value={language === LANGUAGES.VI ? doctorExtra.priceTypeData.valueVi : doctorExtra.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true} suffix={language === LANGUAGES.VI ? 'VND . ' : '$ . '}
                                />
                            }
                        </span>
                    }
                    {isShow === false &&
                        <span className='more-infor'
                            onClick={() => setIsShow(true)}
                        >
                            <FormattedMessage id="patient.extra-doctor.detai-infor" />
                        </span>
                    }
                </div>
                {isShow === true &&
                    <div className='body-center'>
                        <div className='top'>
                            <div className='top-price'>
                                <span className='price-title'>
                                    <FormattedMessage id="patient.extra-doctor.price" />
                                </span>
                                <span className='price'>
                                    {doctorExtra && !_.isEmpty(doctorExtra) &&
                                        < NumberFormat
                                            value={language === LANGUAGES.VI ? doctorExtra.priceTypeData.valueVi : doctorExtra.priceTypeData.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true} suffix={language === LANGUAGES.VI ? 'VND ' : '$ '}
                                        />
                                    }
                                </span>
                            </div>
                            <div className='top-note'>
                                {doctorExtra && !_.isEmpty(doctorExtra) &&
                                    language === LANGUAGES.VI ? doctorExtra.noteVi : doctorExtra.noteEn
                                }
                            </div>
                        </div>
                        <div className='down'>
                            <span className='note'>
                                <FormattedMessage id="patient.extra-doctor.text-payment" />
                                {doctorExtra && !_.isEmpty(doctorExtra) &&
                                    language === LANGUAGES.VI ?
                                    ' ' + doctorExtra.paymentTypeData.valueVi
                                    :
                                    ' ' + doctorExtra.paymentTypeData.valueEn
                                }
                            </span>
                        </div>
                    </div>
                }
                {isShow === true &&
                    <div className='btn-hidden'>
                        <span onClick={() => setIsShow(false)}>
                            <FormattedMessage id="patient.extra-doctor.hidden-infor" />
                        </span>
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrainfor);
