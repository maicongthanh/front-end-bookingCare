/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './SearchClinic.scss'
import { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import Wrapper from '../Patient/Popper/Wrapper'
import { useHistory } from 'react-router';
import { useDebounce } from '../../components/hooks/index'
import ProfileClinic from '../Patient/Clinic/ProfileClinic';
import { searchClinicByString } from '../../services/clinicService';
import { LANGUAGES } from '../../utils';
const SearchClinic = (props) => {

    const { language, setIsOnChangeClassAllClinic } = props
    const history = useHistory()

    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(true)
    const [loading, setLoading] = useState(false)


    const inputRef = useRef()

    const debounced = useDebounce(searchValue, 800)

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
        if (!debounced.trim()) {
            setIsOnChangeClassAllClinic(false)
            setSearchResult([])
            return;
        }
        setLoading(true)
        let res = await searchClinicByString({
            q: debounced,
            limit: 4
        })
        if (res && res.errCode === 0) {
            setIsOnChangeClassAllClinic(true)
            setLoading(false)
            setSearchResult(res.data)
        } else {
            setIsOnChangeClassAllClinic(false)
            setLoading(false)
        }
    }

    const handleViewProfile = (item) => {
        history.push(`/detail-clinic/${item.id}`)
        setSearchResult([])
    }

    const handleFocus = () => {
        setShowResult(true)
        if (searchResult.length > 0) {
            setIsOnChangeClassAllClinic(true)
        }
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
                                    className='detail-clinic-search'
                                    onClick={() => handleViewProfile(item)}
                                >
                                    <ProfileClinic
                                        data={item}
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
                    placeholder={language === LANGUAGES.VI ? 'Tìm kiếm phòng khám' : 'Search clinic'}
                    value={searchValue}
                    onChange={(event) => {
                        setSearchValue(event.target.value)

                    }}
                    onFocus={handleFocus}
                    onBlur={() => setIsOnChangeClassAllClinic(false)}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchClinic);
