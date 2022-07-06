/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import './AllDoctor.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import Footer from '../../HomePage/Footer';
import Information from '../../HomePage/Section/Information';
import { getTopDocTor } from '../../../services/userService';
import ProfileDoctor from './ProfileDoctor';
import Search from '../../Search/Search';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
const AllDoctor = (props) => {

    const { language } = props
    const history = useHistory()

    const [listIdTopDoctor, setListIdTopDoctor] = useState([])
    const [isOnChangeClassAllDoctor, setIsOnChangeClassAllDoctor] = useState(false)
    const fetchALlIdTopDoctor = async () => {
        let res = await getTopDocTor(10, 'TYPE1')
        if (res && res.errCode === 0) {
            setListIdTopDoctor(res.data)
        }
    }

    useEffect(() => {
        fetchALlIdTopDoctor()
    }, [])

    const handleViewDetailDoctor = (item) => {
        history.push(`/detail-doctor/${item.id}`)
    }

    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className='all-doctor-container container'>
                <div className='tippy-content'>
                    <Search
                        setIsOnChangeClassAllDoctor={setIsOnChangeClassAllDoctor}
                    />
                </div>

                <div
                    className={isOnChangeClassAllDoctor === false ? 'content-doctor' : 'content-doctor active'}
                >
                    <div className='title-outstanding-doctor'>
                        <FormattedMessage id="homepage.out-standing-doctor" />
                    </div>
                    <div
                        className='outstanding-doctor'
                    >
                        {listIdTopDoctor && listIdTopDoctor.length > 0 &&
                            listIdTopDoctor.map((item, index) => {
                                return (
                                    <div className='detail-doctor'
                                        key={index}
                                        onClick={() => handleViewDetailDoctor(item)}
                                    >
                                        <ProfileDoctor
                                            doctorId={item.id}
                                            isOpenShowSpecialty={true}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(memo(AllDoctor));
