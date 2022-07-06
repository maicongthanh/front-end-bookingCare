/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './AllClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import Footer from '../../HomePage/Footer';
import Information from '../../HomePage/Section/Information';
import SearchClinic from '../../Search/SearchClinic';
import { useEffect, useState } from 'react';
import { getAllClinic } from '../../../services/clinicService';
import ProfileClinic from './ProfileClinic';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';


const AllClinic = (props) => {

    const history = useHistory()

    const [listClinic, setListClinic] = useState([])
    const [isOnChangeClassAllClinic, setIsOnChangeClassAllClinic] = useState(false)

    const fetchAllClinic = async () => {
        let res = await getAllClinic('TYPE1')
        if (res && res.errCode === 0) {
            setListClinic(res.data)
        }
    }

    useEffect(() => {
        fetchAllClinic()
    }, [])

    const handleViewDetailClinic = (item) => {
        history.push(`/detail-clinic/${item.id}`)
    }

    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className='all-clinic-container container'>
                <div className='tippy-content'>
                    <SearchClinic
                        setIsOnChangeClassAllClinic={setIsOnChangeClassAllClinic}
                    />
                </div>

                <div
                    className={isOnChangeClassAllClinic === false ? 'content-clinic' : 'content-clinic active'}
                >
                    <div className='title-clinic'>
                        <FormattedMessage id="patient.clinic.outstanding-clinic" />
                    </div>
                    <div
                        className='content-clinic'
                    >
                        {listClinic && listClinic.length > 0 &&
                            listClinic.map((item, index) => {
                                return (
                                    <div
                                        className='detail-clinic'
                                        key={index}
                                        onClick={() => handleViewDetailClinic(item)}
                                    >
                                        <ProfileClinic
                                            data={item}
                                            isOnChangeClassAllClinic={true}
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllClinic);
