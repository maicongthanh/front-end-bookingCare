/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './Search.scss'
import { useEffect, useState, useRef } from 'react';
import ProfileDoctor from '../Patient/Doctor/ProfileDoctor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import Wrapper from '../Patient/Popper/Wrapper'
import { searchDoctorByString } from '../../services/userService';
import { LANGUAGES, USER_ROLE } from '../../utils/constant';
import { useHistory } from 'react-router';
import { useDebounce } from '../../components/hooks/index'
const Search = (props) => {

    const { language, setIsOnChangeClassAllDoctor } = props
    const history = useHistory()


    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(true)
    const [loading, setLoading] = useState(false)

    const debounced = useDebounce(searchValue, 800)

    const inputRef = useRef()

    useEffect(() => {
        fetchApiResult()
    }, [debounced])

    const handleClear = () => {
        setSearchValue('')
        setSearchResult([])
        inputRef.current.focus()
    }

    const handleHideResult = () => {
        setShowResult(false)
    }

    const fetchApiResult = async () => {
        setLoading(true)
        if (!debounced.trim()) {
            setIsOnChangeClassAllDoctor(false)
            setSearchResult([])
            setLoading(false)
            return;

        }
        let res = await searchDoctorByString({
            q: debounced,
            role: USER_ROLE.DOCTOR,
            limit: 5
        })
        if (res && res.errCode === 0) {
            setIsOnChangeClassAllDoctor(true)
            setLoading(false)
            setSearchResult(res.data)
        } else {
            setIsOnChangeClassAllDoctor(false)
            setLoading(false)
        }
    }

    const handleViewProfile = (item) => {
        history.push(`detail-doctor/${item.id}`)
        setSearchResult([])
    }



    return (
        <Tippy
            interactive={true}
            visible={showResult && searchResult.length > 0}
            render={attrs => (
                <div
                    className='search-result'
                    tabIndex="-1" {...attrs}
                >
                    <Wrapper>
                        <h4 className='search-title'>
                            {language === LANGUAGES.VI ? 'Kết quả tìm kiếm' : 'Result search'}
                        </h4>
                        {searchResult.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className='detail-doctor-search'
                                    onClick={() => handleViewProfile(item)}
                                >
                                    <ProfileDoctor

                                        doctorId={item.id}
                                        isOpenShowSpecialty={true}
                                    />
                                </div>

                            )
                        })}
                    </Wrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <div className='content-search'>
                <input
                    ref={inputRef}
                    type='text'
                    className='search'
                    spellCheck={false}
                    placeholder={language === LANGUAGES.VI ? 'Tìm kiếm bác sĩ' : 'Search doctor'}
                    value={searchValue}
                    onChange={(event) => {
                        setSearchValue(event.target.value)

                    }}
                    onFocus={() => setShowResult(true)}
                />
                {!!searchValue && !loading && (
                    <button className='icon-clear'
                        onClick={handleClear}
                    >
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}

                {loading && <FontAwesomeIcon className='spinner' icon={faSpinner} />}

                <button className='search-btn'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </Tippy>
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
