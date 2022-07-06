/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './AllSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import Footer from '../../HomePage/Footer';
import ProfileSpecialty from './ProfileSpecialty';
import { useEffect, useState } from 'react';
import { getAllSpecialty } from '../../../services/specialtyService'
import { useHistory } from 'react-router';
import Information from '../../HomePage/Section/Information';
import { FormattedMessage } from 'react-intl';
const AllSpecialty = (props) => {

    const { language } = props
    const history = useHistory()

    const [listSpecialty, setListSpecialty] = useState([])

    const fetchAllSpecialty = async () => {
        let res = await getAllSpecialty('TYPE1')
        console.log(res);
        if (res && res.errCode === 0) {
            setListSpecialty(res.data)
        }
    }

    useEffect(() => {
        fetchAllSpecialty()
    }, [])

    const handleViewDetailSpecialty = (item) => [
        history.push(`/detail-specialty/${item.id}`)
    ]

    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className='all-specialty-container container'>
                <div className='title-specialty'>
                    <FormattedMessage id="patient.specialty.popular-specialties" />
                </div>
                <div className='list-specialty'>
                    {listSpecialty && listSpecialty.length > 0 &&
                        listSpecialty.map((item) => {
                            return (
                                <span
                                    key={item.id}
                                    onClick={() => handleViewDetailSpecialty(item)}
                                >
                                    <ProfileSpecialty
                                        data={item}
                                    />
                                </span>
                            )
                        })}

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

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty);
