import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Wrapper from '../Patient/Popper/Wrapper';
import { useHistory } from 'react-router';

const Header = (props) => {

    const history = useHistory()

    const [isShowOption, setIsShowOption] = useState(false)

    const { processLogout, language, changeLanguageApp, userInfo } = props;
    const handleChangeLanguage = (language) => {
        changeLanguageApp(language)
    }
    const [menuApp, setMenuApp] = useState([])
    let fullNameVi, fullNameEn, imageBase64;
    if (userInfo) {
        fullNameVi = `${userInfo.firstName} ${userInfo.lastName}`
        fullNameEn = `${userInfo.lastName} ${userInfo.firstName}`
        imageBase64 = Buffer.from(userInfo.image, 'base64').toString('binary');
    }

    useEffect(() => {
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.role
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu
            }
        }
        setMenuApp(menu)
    }, [userInfo])

    const handleShowOptions = () => {
        setIsShowOption(!isShowOption)
    }

    const handleHideResult = () => {
        setIsShowOption(false)
    }

    const handleViewProfile = () => {
        history.push('/system/profile')
    }

    return (
        <div className="header-container">
            {/* thanh navigator */}
            <div className="header-tabs-container">
                <Navigator menus={menuApp} />
            </div>


            <div className='header-options'>
                <div className='languages'>
                    <span
                        className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}
                        onClick={() => handleChangeLanguage(LANGUAGES.VI)}
                    >VN
                    </span>
                    <span
                        className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}
                        onClick={() => handleChangeLanguage(LANGUAGES.EN)}
                    >
                        EN
                    </span>
                </div>
                <span className='welcome'>
                    <FormattedMessage id="home-header.welcome" />
                    , {userInfo && language === LANGUAGES.VI ? ` ${fullNameVi} ` : ` ${fullNameEn} `}
                </span>

                <Tippy
                    interactive={true}
                    visible={isShowOption}
                    render={attrs => (
                        <div
                            className='search-result'
                            tabIndex="-1" {...attrs}
                        >
                            {isShowOption === true &&
                                <Wrapper
                                    className='customer-wrapper'
                                >
                                    <div className='information-profile'>
                                        <span className='title-profile'
                                            onClick={handleViewProfile}
                                        >
                                            Thông tin cá nhân
                                        </span>
                                        <span
                                            className='logout'
                                            onClick={processLogout}
                                        >
                                            Đăng xuất
                                        </span>
                                    </div>
                                </Wrapper>
                            }
                        </div>
                    )}
                    onClickOutside={handleHideResult}
                >
                    <div
                        className='profile'
                    >
                        <div
                            className='avatar'
                            style={{
                                backgroundImage: `url(${imageBase64})`
                            }}
                            onClick={handleShowOptions}
                        >
                        </div>
                    </div>
                </Tippy>

            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageApp: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
