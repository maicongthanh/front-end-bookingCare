import { connect } from 'react-redux';

import * as actions from '../../store/actions'
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import logo from '../../assets/logo.svg'
import banner from '../../assets/banner.jpg'
import { LANGUAGES, USER_ROLE } from '../../utils/constant'
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchAllByString } from '../../services/userService';
import Wrapper from '../Patient/Popper/Wrapper';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDebounce } from '../../components/hooks';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const HomeHeader = (props) => {

    const [isOpenMenu, setIsOpenMenu] = useState(false)

    const [loading, setLoading] = useState(false)
    const placeholderTextVi = ["Tìm kiếm bác sĩ", "Tìm kiếm phòng khám", "Tìm kiếm chuyên khoa"];
    const placeholderTextEn = ["Find a doctor", "Find a clinic", "Find a specialty"];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = () => {
            setIndex(prevIndex => {
                if (prevIndex === placeholderTextVi.length - 1) {
                    return 0;
                }
                return prevIndex + 1;
            })
        };
        setInterval(timer, 4000);

        return () => { clearInterval(timer); }
    }, []);


    const history = useHistory()
    const [searchValue, setSearchValue] = useState('')
    const [listDoctor, setListDoctor] = useState([])
    const [listClinic, setListClinic] = useState([])
    const [listSpecialty, setListSpecialty] = useState([])
    const [showResult, setShowResult] = useState(true)

    const { language, changeLanguageApp, isShowBanner } = props

    const handleChangeLanguage = (language) => {
        changeLanguageApp(language)
    }

    const returnToHome = () => {
        history.push('/home')
    }

    const handleViewAllSpecialty = () => {
        history.push('/all-specialty')
    }
    const handleViewAllClinic = () => {
        history.push('/all-clinic')
    }
    const handleViewAllDoctor = () => {
        history.push('/all-doctor')
    }

    const handleOnChange = async (event) => {
        setShowResult(true)
        setSearchValue(event.target.value)
    }

    //Search
    const handleHideResult = () => {
        setShowResult(false)
    }

    const debounced = useDebounce(searchValue, 800)

    useEffect(() => {
        fetchSearchAll()
    }, [debounced])

    const fetchSearchAll = async () => {
        if (!debounced.trim()) {
            setListClinic([])
            setListSpecialty([])
            setListDoctor([])
            setShowResult(false)
            return;
        }
        setLoading(true)
        let res = await searchAllByString({
            q: debounced,
            role: USER_ROLE.DOCTOR,
            limit: 5
        })
        if (res && res.errCode === 0) {
            setLoading(false)
            setListClinic(res.data)
            setListSpecialty(res.data1)
            setListDoctor(res.data2)
        } else {
            setLoading(false)
        }
    }

    const handleShowResult = () => {
        if (listClinic.length > 0 || listDoctor.length > 0 || listSpecialty.length > 0) {
            setShowResult(true)
        } else {
            setShowResult(false)
        }
    }


    const handleViewProfile = (item) => {
        history.push(`detail-doctor/${item.id}`)
    }
    const handleViewSpecialty = (item) => {
        history.push(`detail-specialty/${item.id}`)
    }
    const handleViewClinic = (item) => {
        history.push(`detail-clinic/${item.id}`)
    }

    const handleOpenMenu = () => {
        setIsOpenMenu(true)
    }

    return (
        <>
            {isOpenMenu === true &&
                <div className='menu-container'
                    onClick={() => setIsOpenMenu(false)}
                >
                    <div className='menu-content'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='menu-title'
                            onClick={() => returnToHome()}
                        >
                            {language === LANGUAGES.VI ? 'Trang chủ' : 'HomePage'}
                        </div>
                        <div className='menu-title'
                            onClick={() => handleViewAllDoctor()}

                        >
                            {language === LANGUAGES.VI ? 'Tìm kiếm bác sĩ' : 'Find a doctor'}


                        </div>
                        <div className='menu-title'
                            onClick={() => handleViewAllSpecialty()}
                        >
                            {language === LANGUAGES.VI ? 'Tìm kiếm chuyên khoa' : 'Find a specialty'}


                        </div>
                        <div className='menu-title'
                            onClick={() => handleViewAllClinic()}
                        >
                            {language === LANGUAGES.VI ? 'Tìm kiếm phòng khám' : 'Find a clinic'}
                        </div>
                    </div>
                </div>
            }
            <div className='home-header-container '>
                <div className="container">
                    <div className='home-header-content row'>
                        <div className='col-lg-3 col-6 content-left ' >
                            <span className='header-icon'
                                onClick={handleOpenMenu}
                            >
                                <i className="fas fa-bars"></i>
                            </span>
                            <div
                                className='header-logo'
                                style={{
                                    backgroundImage: `url(${logo})`
                                }}
                                onClick={() => returnToHome()}
                            >
                            </div>
                        </div>
                        <div className='col-lg-6 content-center hide-md'>
                            <div
                                className='content-section'
                                onClick={() => handleViewAllSpecialty()}
                            >
                                <div className='content-section-title'>
                                    <FormattedMessage id="home-header.specialty" />
                                </div>
                                <span>
                                    <FormattedMessage id="home-header.search-doctor" />
                                </span>
                            </div>
                            <div
                                className='content-section'
                                onClick={() => handleViewAllClinic()}
                            >
                                <div className='content-section-title'>
                                    <FormattedMessage id="home-header.health-facility" />
                                </div>
                                <span>
                                    <FormattedMessage id="home-header.select-room" />
                                </span>
                            </div>
                            <div
                                className='content-section'
                                onClick={() => handleViewAllDoctor()}
                            >
                                <div className='content-section-title'>
                                    <FormattedMessage id="home-header.doctor" />
                                </div>
                                <span>
                                    <FormattedMessage id="home-header.choose-doctor" />
                                </span>
                            </div>
                            <div className='content-section'>
                                <div className='content-section-title'>
                                    <FormattedMessage id="home-header.fee" />
                                </div>
                                <span>
                                    <FormattedMessage id="home-header.check-health" />
                                </span>
                            </div>
                        </div>
                        <div className='col-lg-3 col-6 content-right'>
                            <div className='left'>
                                <span
                                    className=
                                    {
                                        language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'
                                    }
                                    onClick={() => handleChangeLanguage(LANGUAGES.VI)}
                                >
                                    VN
                                </span>
                                <span
                                    className=
                                    {
                                        language === LANGUAGES.EN ? 'language-en active' : 'language-en'
                                    }
                                    onClick={() => handleChangeLanguage(LANGUAGES.EN)}
                                >
                                    EN
                                </span>
                            </div>
                            <div className='right'>
                                <span className='icon'>
                                    <i className="fas fa-question"></i>
                                </span>
                                <span className='support'>
                                    <FormattedMessage id="home-header.support" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


            </div >
            {isShowBanner === true &&
                <div className='home-header-banner' style={{ backgroundImage: `url(${banner})` }}>
                    <div className="banner-content">
                        <div className='content-up'>
                            <div className='title1'>
                                <FormattedMessage id="banner.title1" />

                            </div>
                            <div className='title2'>
                                <FormattedMessage id="banner.title2" />
                            </div>
                            <div className='content-search'>
                                <span className='icon'>
                                    <i className="fas fa-search"></i>
                                </span>
                                <Tippy
                                    placement='bottom'
                                    interactive={true}
                                    visible={showResult && listDoctor.length > 0 || listClinic.length > 0 || listSpecialty.length > 0}
                                    render={attrs => (
                                        <div
                                            className='search-result'
                                            tabIndex="-1" {...attrs}
                                        >
                                            {showResult === true &&
                                                <Wrapper
                                                >
                                                    <div className='doctor-search'>
                                                        {listDoctor && listDoctor.length > 0 &&
                                                            <div className='doctor-search-title'>
                                                                <FormattedMessage id="home-header.doctor" />
                                                            </div>
                                                        }
                                                        {listDoctor && listDoctor.length > 0 &&
                                                            listDoctor.map((item, index) => {
                                                                let imageBase64
                                                                let nameVi = `${item.firstName} ${item.lastName}`
                                                                let nameEn = `${item.lastName} ${item.firstName}`

                                                                if (item.image) {
                                                                    imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                                                }
                                                                return (
                                                                    <div className='avatar-content' key={index}
                                                                        onClick={() => handleViewProfile(item)}
                                                                    >
                                                                        <div className='avatar-doctor'
                                                                            style={{
                                                                                backgroundImage: `url(${imageBase64})`
                                                                            }}
                                                                        >
                                                                        </div>
                                                                        <span>
                                                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className='doctor-search'>
                                                        {listClinic && listClinic.length > 0 &&
                                                            <div className='doctor-search-title'>
                                                                <FormattedMessage id="home-header.clinic" />
                                                            </div>
                                                        }

                                                        {listClinic && listClinic.length > 0 &&
                                                            listClinic.map((item, index) => {

                                                                let imageBase64
                                                                let nameVi = item.nameVi
                                                                let nameEn = item.nameEn

                                                                if (item.background) {
                                                                    imageBase64 = Buffer.from(item.background, 'base64').toString('binary');
                                                                }
                                                                return (
                                                                    <div className='avatar-content'
                                                                        key={index}
                                                                        onClick={() => handleViewClinic(item)}
                                                                    >
                                                                        <div className='avatar-doctor'
                                                                            style={{
                                                                                backgroundImage: `url(${imageBase64})`
                                                                            }}
                                                                        >
                                                                        </div>
                                                                        <span>
                                                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className='doctor-search'>
                                                        {listSpecialty && listSpecialty.length > 0 &&
                                                            <div className='doctor-search-title'>
                                                                <FormattedMessage id="home-header.specialty" />
                                                            </div>
                                                        }

                                                        {listSpecialty && listSpecialty.length > 0 &&
                                                            listSpecialty.map((item, index) => {
                                                                let imageBase64
                                                                let nameVi = item.nameVi
                                                                let nameEn = item.nameEn

                                                                if (item.image) {
                                                                    imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                                                }
                                                                return (
                                                                    <div className='avatar-content' key={index}
                                                                        onClick={() => handleViewSpecialty(item)}

                                                                    >
                                                                        <div className='avatar-doctor'
                                                                            style={{
                                                                                backgroundImage: `url(${imageBase64})`
                                                                            }}
                                                                        >
                                                                        </div>
                                                                        <span>
                                                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </Wrapper>
                                            }
                                        </div>
                                    )}
                                    onClickOutside={handleHideResult}
                                >
                                    <input
                                        type="text"
                                        className='search'
                                        placeholder={language === LANGUAGES.VI ? placeholderTextVi[index] : placeholderTextEn[index]}
                                        value={searchValue}
                                        onChange={(event) => handleOnChange(event)}
                                        onFocus={handleShowResult}
                                    />

                                </Tippy>

                                {loading && <FontAwesomeIcon className='spinner' icon={faSpinner} />}

                            </div>
                        </div>
                        <div className='content-down'>
                            <div className="container">
                                <div className="row options-content">
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-hospital-alt"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option1" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-mobile-alt"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option2" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-briefcase-medical"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option3" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-notes-medical"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option4" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-user-md"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option5" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-prescription-bottle-alt"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option6" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-cube"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option7" />
                                        </p>
                                    </div>
                                    <div className='option'>
                                        <span className='option-icon'>
                                            <i className="fas fa-ambulance"></i>
                                        </span>
                                        <p className='option-title'>
                                            <FormattedMessage id="banner.option8" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        changeLanguageApp: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
