import { connect } from 'react-redux';
// import * as actions from '../../store/actions'
import './HandBook.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import { getAllPostsService } from '../../../services/postsService';
import { LANGUAGES } from '../../../utils/constant';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
const HandBook = (props) => {
    const { settings, language } = props
    const [listPosts, setListPosts] = useState([])
    const history = useHistory()
    const fetchAllPosts = async () => {
        let res = await getAllPostsService()
        if (res && res.errCode === 0) {
            setListPosts(res.data)
        }
    }

    const handleViewPosts = (item) => {
        history.push(`/detail-posts/${item.id}`)
    }

    useEffect(() => {
        fetchAllPosts()
    }, [])
    return (
        <div className='section-share handbook'>
            <div className='container'>
                <div className='section-content'>
                    <div className="content-up">
                        <div className="section-label">
                            <FormattedMessage id="patient.posts.title" />
                        </div>
                        <span className='more'>
                            <button>
                                <FormattedMessage id="patient.posts.all-post" />
                            </button>
                        </span>
                    </div>
                    <div className='content-down'>
                        <Slider {...settings}>
                            {listPosts && listPosts.length > 0 &&
                                listPosts.map((item, index) => {
                                    let imageBase64
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div className='section-option-handbook'
                                            key={index}
                                            onClick={() => handleViewPosts(item)}
                                        >
                                            <div className='section-image-handbook'
                                                style={{
                                                    backgroundImage: `url(${imageBase64})`
                                                }}
                                            ></div>
                                            <div className='handbook-title'>
                                                {language === LANGUAGES.VI ? item.titleVi : item.titleEn}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
