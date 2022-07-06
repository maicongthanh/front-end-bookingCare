/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './DetailDoctor.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import { useEffect, useState } from 'react';
import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import Footer from '../../HomePage/Footer';
import Information from '../../HomePage/Section/Information';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtrainfor from './DoctorExtrainfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare'
import Comment from '../SocialPlugin/Comment'
const DetailDoctor = (props) => {

    const { language } = props

    const [detailDoctor, setDetailDoctor] = useState({})
    const [doctorId, setDoctorId] = useState('')
    useEffect(() => {
        getDetailDoctor()
    }, [])

    const getDetailDoctor = async () => {
        if (props.match && props.match.params && props.match.params.id) {
            let doctorId = props.match.params.id
            setDoctorId(doctorId)
            let response = await getDetailInforDoctor(doctorId)
            if (response && response.errCode === 0) {
                setDetailDoctor(response.data);
            }
        }
    }

    let labelVi = '';
    let labelEn = '';
    if (detailDoctor && detailDoctor.positionData) {
        labelVi = ` ${detailDoctor.positionData.valueVi} , ${detailDoctor.firstName} ${detailDoctor.lastName} `
        labelEn = ` ${detailDoctor.positionData.valueEn} , ${detailDoctor.lastName} ${detailDoctor.firstName} `
    }

    let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ? "https://github.com/maicongthanh" : window.location.href;
    return (
        <>
            <HomeHeader isShowBanner={false} />
            <div className='doctor-detail-container container'>
                <div className='intro-doctor'>
                    <div
                        className='content-left'
                        style={{
                            backgroundImage: `url(${detailDoctor.image})`,
                        }}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? labelVi : labelEn}
                        </div>
                        <div className='down'>
                            {
                                detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.descriptionVi && detailDoctor.Markdown.descriptionEn &&
                                <span>
                                    {language === LANGUAGES.VI ? detailDoctor.Markdown.descriptionVi : detailDoctor.Markdown.descriptionEn}
                                </span>
                            }
                            <div className='like-share-plugin'>
                                <LikeAndShare
                                    dataHref={currentURL}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='schedule-doctor'>
                    <div className='content-left'>
                        <DoctorSchedule
                            doctorId={doctorId}
                        />
                    </div>
                    <div className='content-right'>
                        <DoctorExtrainfor
                            doctorId={doctorId}
                        />
                    </div>
                </div>
            </div>
            <div className='detail-infor-doctor-background'>
                <div className='detail-infor-doctor container'>
                    {
                        detailDoctor && detailDoctor.Markdown
                        && detailDoctor.Markdown.contentHTMLEn && detailDoctor.Markdown.contentHTMLVi
                        &&
                        <div dangerouslySetInnerHTML={{ __html: language === LANGUAGES.VI ? detailDoctor.Markdown.contentHTMLVi : detailDoctor.Markdown.contentHTMLEn }} >
                        </div>
                    }
                    <div className='comment-doctor'>
                        <Comment
                            width={"100%"}
                            dataHref={currentURL}
                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
