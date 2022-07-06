/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getDetailPost } from '../../../services/postsService';
import { LANGUAGES } from '../../../utils/constant';
import Footer from '../../HomePage/Footer';
import HomeHeader from '../../HomePage/HomeHeader';
import Information from '../../HomePage/Section/Information';
import './DetailPost.scss';

const DetailPost = (props) => {

    const { language } = props

    const [detailPost, setDetailPost] = useState()

    const fetchDetailPost = async () => {
        if (props.match && props.match.params && props.match.params.id) {
            let postId = props.match.params.id
            let response = await getDetailPost(postId)
            if (response && response.errCode === 0) {
                setDetailPost(response.data);
            }
        }
    }
    let contentHTMLVi, contentHTMLEn, titleVi, titleEn
    if (detailPost && !_.isEmpty(detailPost)) {
        titleVi = detailPost.titleVi
        titleEn = detailPost.titleEn
        contentHTMLVi = detailPost.contentHTMLVi
        contentHTMLEn = detailPost.contentHTMLEn
    }

    useEffect(() => {
        fetchDetailPost()
    }, [])

    console.log(detailPost);
    return (
        <>
            <HomeHeader isShowBanner={false} />


            <div className='detail-post-container container'>
                <div className='detail-title'>
                    <h2> {language === LANGUAGES.VI ? titleVi : titleEn}</h2>
                </div>
                <div className='describe-posts'>
                    <div dangerouslySetInnerHTML={{ __html: language === LANGUAGES.VI ? contentHTMLVi : contentHTMLEn }} >
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailPost);
