import React from 'react'
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';

const InformationClinic = (props) => {

    const { language } = props

    const title1Vi = `BookingCare là Nền tảng Y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam kết nối người dùng với trên 150 bệnh viện - phòng khám uy tín, hơn 1,000 bác sĩ chuyên khoa giỏi và hàng nghìn dịch vụ, sản phẩm y tế chất lượng cao.`
    const title2Vi = `Từ nay, người bệnh có thể đặt lịch tại Khu khám bệnh theo yêu cầu, Bệnh viện Hữu nghị Việt Đức thông qua hệ thống đặt khám BookingCare.`
    const title3Vi = `Được lựa chọn các giáo sư, tiến sĩ, bác sĩ chuyên khoa giàu kinh nghiệm`
    const title4Vi = `Hỗ trợ đặt khám trực tuyến trước khi đi khám (miễn phí đặt lịch)`
    const title5Vi = `Giảm thời gian chờ đợi khi làm thủ tục khám và ưu tiên khám trước`
    const title6Vi = `Nhận được hướng dẫn chi tiết sau khi đặt lịch`

    const title1En = `BookingCare is Vietnam's leading comprehensive healthcare platform connecting users with over 150 prestigious hospitals - clinics, more than 1,000 good specialists and thousands of quality medical products and services. high`
    const title2En = `From now on, patients can make an appointment at the On-Demand Clinic, Viet Duc Friendship Hospital through the BookingCare booking system.`
    const title3En = `Selected professors, doctors, specialists with experience`
    const title4En = `Support to book online before going to the doctor (free of charge)`
    const title5En = `Reduce waiting time during check-in procedures and prioritize first check-ups`
    const title6En = `Get detailed instructions after booking`


    return (
        <>
            <div className='content-1'>
                <i className="fas fa-lightbulb"></i>
                <span>
                    {language === LANGUAGES.VI ? title1Vi : title1En}
                </span>
            </div>
            <div className='content-2 mb-3'>
                <span>
                    {language === LANGUAGES.VI ? title2Vi : title2En}

                </span>
                <ul>
                    <li>{language === LANGUAGES.VI ? title3Vi : title3En}
                    </li>
                    <li>                    {language === LANGUAGES.VI ? title4Vi : title4En}
                    </li>
                    <li>                    {language === LANGUAGES.VI ? title5Vi : title5En}
                    </li>
                    <li>                    {language === LANGUAGES.VI ? title6Vi : title6En}
                    </li>
                </ul>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InformationClinic);