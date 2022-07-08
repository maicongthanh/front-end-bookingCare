/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import Footer from '../../HomePage/Footer';
import { useEffect, useState } from 'react';
import { getDetailSpecialty } from '../../../services/specialtyService';
import { LANGUAGES } from '../../../utils/constant';
import DoctorExtrainfor from '../Doctor/DoctorExtrainfor';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllCodeApi, getDoctorWithSpecialtyAndLocationById } from '../../../services/userService';
import RoleBookingCare from '../RoleBookingCare/RoleBookingCare';
import Information from '../../HomePage/Section/Information';
import { FormattedMessage } from 'react-intl';
const DetailSpecialty = (props) => {
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    useEffect(() => {
        topFunction()
    }, [])
    const { language } = props
    let specialtyId = ''
    if (props && props.match && props.match.params) {
        specialtyId = props.match.params.id
    }
    const [informationSpecialty, setInformationSpecialty] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    const [arrDoctorId, setArrDoctorId] = useState([])
    const [arrProvince, setArrProvince] = useState([])
    const [selectedProvince, setSelectedProvince] = useState('')

    const fetchInformationDetailSpecialty = async () => {
        let res = await getDetailSpecialty(specialtyId)
        if (res && res.errCode === 0) {
            setInformationSpecialty(res.data)
        }
    }

    const fetchAllProvince = async () => {
        let res = await getAllCodeApi('PROVINCE')
        if (res && res.errCode === 0) {
            let objectAll = {
                keyMap: 'ALL',
                valueVi: 'Toàn Quốc',
                valueEn: 'ALL'
            }
            let listNewProvince = res.data
            listNewProvince.unshift(objectAll)
            setArrProvince(listNewProvince)
        }
    }

    const fetchAllDoctorOfSpecialty = async () => {
        let res = await getDoctorWithSpecialtyAndLocationById(specialtyId, selectedProvince)
        if (res && res.errCode === 0) {
            setArrDoctorId(res.data)
        }
    }

    useEffect(() => {
        fetchInformationDetailSpecialty()
        fetchAllProvince()
    }, [])

    useEffect(() => {
        fetchAllDoctorOfSpecialty()
    }, [selectedProvince])

    const handleOnchangeSelect = async (event) => {
        setSelectedProvince(event.target.value)
    }
    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className={isOpen === true ? 'specialty-background active' : 'specialty-background'}>
                <div className='specialty-background-modal'>
                    <div className='introduction-specialty container'>
                        <div className='content-full'>
                            {informationSpecialty &&
                                <div dangerouslySetInnerHTML={{ __html: language === LANGUAGES.VI ? informationSpecialty.descriptionHTMLVi : informationSpecialty.descriptionHTMLEn }} >
                                </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
            <div className='btn-more-information container'
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen === false ?
                    <FormattedMessage id="patient.specialty.more" />
                    :
                    <FormattedMessage id="patient.specialty.hidden" />
                }
            </div>
            <div className='specialty-container'>
                <div className='specialty-content container'>
                    <div className='specialty-location'>
                        <select
                            onChange={(event) => handleOnchangeSelect(event)}
                            value={selectedProvince}
                        >
                            {arrProvince && arrProvince.length > 0 &&
                                arrProvince.map((item, index) => {
                                    return (
                                        <option
                                            value={item.keyMap}
                                            key={index}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className='doctor-specialty' key={index}>
                                    <div className='content-left'>
                                        <div className='profile-doctor' >
                                            <ProfileDoctor
                                                doctorId={item.doctorId}
                                                isOpenInformationDescription={true}
                                            />
                                        </div>
                                    </div>
                                    <div className='content-right'>
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule
                                                doctorId={item.doctorId}
                                            />
                                        </div>
                                        <div className='doctor-extra-information'>
                                            <DoctorExtrainfor
                                                doctorId={item.doctorId}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <RoleBookingCare />
            <Information />
            <Footer />
        </>
    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
