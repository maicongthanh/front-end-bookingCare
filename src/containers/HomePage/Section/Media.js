import { connect } from 'react-redux';
import './Media.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils/constant';
const Media = (props) => {

    const { language } = props

    const contentVi = `
    Sir Alexander Chapman "Alex" Ferguson CBE (sinh ngày 31 tháng 12 năm 1941) là một cựu cầu thủ và huấn luyện viên bóng đá người Scotland. Trong vòng 27 năm (1986–2013), ông đã giúp Manchester United trở thành 1 trong 2 câu lạc bộ bóng đá vĩ đại nhất lịch sử nước Anh với 20 lần vô địch giải quốc nội. Ngày 12 tháng 6 năm 1999, Ferguson đã được nữ hoàng Anh phong tước hiệu Hiệp sĩ cho những cống hiến của mình trong bóng đá. Với biệt danh "Máy sấy tóc", ông được coi là huấn luyện viên bóng đá xuất sắc và vĩ đại nhất lịch sử. Ông đứng đầu danh sách 100 Huấn luyện viên xuất sắc nhất mọi thời đại của FourFourTwo.
    `
    const contentEn = `
    Sir Alexander Chapman "Alex" Ferguson CBE (born 31 December 1941) is a Scottish former footballer and manager. Within 27 years (1986–2013), he helped Manchester United become one of the two greatest football clubs in English history with 20 league titles. On June 12, 1999, Ferguson was knighted by the Queen of England for his contributions to football. Nicknamed "The Hairdryer", he is considered the greatest and greatest football coach in history. He topped FourFourTwo's list of the 100 Greatest Coaches of All Time.
    `
    return (
        <div className='section-share media'>
            <div className='container'>
                <div className='section-content'>
                    <div className="content-up">
                        <div className="section-label">
                            <FormattedMessage id="patient.media.title" />
                        </div>
                    </div>
                    <div className='row content-down media'>
                        <div className='col-sm-12 video'>
                            <iframe
                                width="100%"
                                height="400px"
                                src="https://www.youtube.com/embed/BlH4GtSqM7U"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>

                            </iframe>
                        </div>
                        <div className='col-sm-12 video-desc'>
                            {language === LANGUAGES.VI ? contentVi : contentEn}
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Media);
