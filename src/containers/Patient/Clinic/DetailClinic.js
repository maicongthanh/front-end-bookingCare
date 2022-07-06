/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './DetailClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import Footer from '../../HomePage/Footer';
import Information from '../../HomePage/Section/Information';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtrainfor from '../Doctor/DoctorExtrainfor';
import RoleBookingCare from '../RoleBookingCare/RoleBookingCare';
import { useEffect, useState } from 'react';
import { getAllSpecialty } from '../../../services/specialtyService';
import { LANGUAGES } from '../../../utils';
import { getDetailClinic } from '../../../services/clinicService';
import _ from 'lodash';
import { getDoctorWithClinicSpecialtyById } from '../../../services/userService';
import InformationClinic from './InformationClinic';
import { FormattedMessage } from 'react-intl';
const DetailClinic = (props) => {
    let clinicId = ''
    if (props && props.match && props.match.params) {
        clinicId = props.match.params.id
    }
    const { language } = props
    const [listSpecialty, setListSpecialty] = useState([])
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [informationClinic, setInformationClinic] = useState({})
    const [listDoctorClinic, setListDoctorClinic] = useState([])
    const fetAllNameSpecialty = async () => {
        let res = await getAllSpecialty('TYPE2')
        if (res && res.errCode === 0) {
            let result = res.data
            let objectAllSpecialty = {
                id: 'ALL',
                nameVi: 'Tất Cả',
                nameEn: 'All Specialty'
            }
            result.unshift(objectAllSpecialty)
            setListSpecialty(result)
        }
    }

    const fetchDetailSpecialty = async () => {
        let res = await getDetailClinic(clinicId)
        if (res && res.errCode === 0) {
            setInformationClinic(res.data)
        }
    }
    let imageBase64, backgroundBase64, descriptionHTML
    if (informationClinic && !_.isEmpty(informationClinic)) {
        imageBase64 = Buffer.from(informationClinic.image, 'base64').toString('binary');
        backgroundBase64 = Buffer.from(informationClinic.background, 'base64').toString('binary');
        descriptionHTML = language === LANGUAGES.VI ? informationClinic.descriptionHTMLVi : informationClinic.descriptionHTMLEn
    }
    const fetchAllDoctorClinic = async (selectedSpecialty) => {
        let res = await getDoctorWithClinicSpecialtyById(clinicId, selectedSpecialty)
        if (res && res.errCode === 0) {
            setListDoctorClinic(res.data)
        }
    }
    useEffect(() => {
        fetAllNameSpecialty()
        fetchDetailSpecialty()

    }, [])

    useEffect(() => {
        fetchAllDoctorClinic(selectedSpecialty)
    }, [selectedSpecialty])

    const handleOnchangeSelect = (event) => {
        setSelectedSpecialty(event.target.value)
    }
    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className='detail-clinic-container container'>
                <div className='background-clinic'
                    style={{
                        backgroundImage: `url(${backgroundBase64})`
                    }}
                >
                </div>
                <div className='introduction-clinic'>
                    <div className='avatar-clinic'
                        style={{
                            backgroundImage: `url(${imageBase64})`
                        }}
                    >
                    </div>
                    <div className='right'>
                        <span className='name-clinic'>
                            {informationClinic && language && language === LANGUAGES.VI ? informationClinic.nameVi : informationClinic.nameEn}
                        </span>
                        <span className='address-clinic'>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>
                                {informationClinic && language && language === LANGUAGES.VI ? informationClinic.addressVi : informationClinic.addressEn}

                            </span>
                        </span>
                    </div>
                </div>

                <InformationClinic />
            </div>
            <div className='clinic-container'>
                <div className='clinic-content container'>
                    <div className='clinic-location'>
                        <div className='title-select-clinic'>
                            <FormattedMessage id="patient.specialty.search" />
                        </div>
                        <select
                            onChange={(event) => handleOnchangeSelect(event)}
                            value={selectedSpecialty}
                        >
                            {listSpecialty && listSpecialty.length > 0 &&
                                listSpecialty.map((item, index) => {
                                    return (
                                        <option
                                            value={item.id}
                                            key={index}
                                        >
                                            {language === LANGUAGES.VI ? item.nameVi : item.nameEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {listDoctorClinic && listDoctorClinic.length > 0 ?
                        listDoctorClinic.map((item, index) => {
                            return (
                                <div className='doctor-clinic'
                                    key={index}
                                >
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
                        :
                        <div className='no-doctor'>
                            Hiện tại chưa có bác sĩ , bạn chọn chuyên khoa khác nhé !
                        </div>
                    }

                </div>
            </div>
            <div className='describe-clinic container'>
                {
                    <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} >
                    </div>
                }
            </div>
            <RoleBookingCare />
            <Information />
            <Footer />
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
