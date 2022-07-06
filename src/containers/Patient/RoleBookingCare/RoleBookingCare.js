/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import './RoleBookingCare.scss';

const RoleBookingCare = (props) => {

    const { language } = props

    const title1Vi = `Vai trò của BookingCare`
    const title2Vi = `Giúp bệnh nhân chọn đúng bác sĩ giỏi và đặt lịch nhanh chóng.`
    const title3Vi = `Hệ thống bác sĩ chuyên khoa giỏi, uy tín`
    const title4Vi = `Sắp xếp khám đúng bác sĩ mà bệnh nhân đã chọn đặt lịch`
    const title5Vi = `Sắp xếp khám đúng bác sĩ mà bệnh nhân đã chọn đặt lịch`
    const title6Vi = `Bảo vệ quyền lợi của bệnh nhân khi đi khám`
    const title7Vi = `Miễn phí đặt lịch.`
    const title8Vi = `Hỗ trợ trước, trong và sau khi đi khám.`
    const title9Vi = `Trước khám`
    const title10Vi = `Nhắc lịch khám, dặn dò chuẩn bị trước khám`
    const title11Vi = `Hướng dẫn đi lại, quy trình làm thủ tục khám`
    const title12Vi = `Trong khi khám`
    const title13Vi = `Hỗ trợ giải quyết các vướng mắc trong khi khám`
    const title14Vi = `Hỗ trợ người bệnh những yêu cầu nảy sinh`
    const title15Vi = `Sau khi khám`
    const title16Vi = `Ghi nhận ý kiến của bệnh nhân sau khám`
    const title17Vi = `Hỗ trợ giải đáp, làm rõ những vấn đề chuyên môn`
    const title18Vi = `Bảo vệ quyền lợi của bệnh nhân khi đi khám`
    const title19Vi = `Cần tìm hiểu thêm?`
    const title20Vi = `Bảo vệ quyền lợi của bệnh nhân khi đi khám`

    const title1En = `The role of BookingCare`
    const title2En = `Help patients choose the right doctor and book an appointment quickly.`
    const title3En = `System of good and reputable specialists`
    const title4En = `Schedule an appointment with the correct doctor that the patient has chosen to schedule an appointment with`
    const title5En = `Schedule an appointment with the correct doctor that the patient has chosen to schedule an appointment with`
    const title6En = `Protecting the patient's rights when going to the doctor`
    const title7En = `Free appointment.`
    const title8En = `Support before, during and after the examination.`
    const title9En = `Before examination`
    const title10En = `Reminder of the examination schedule, advice to prepare before the examination`
    const title11En = `Travel guide, check-in procedures`
    const title12En = `While examining`
    const title13En = `Support to solve problems during examination`
    const title14En = `Support patients with arising requirements`
    const title15En = `After examination`
    const title16En = `Support to answer and clarify professional issues`
    const title17En = `Record the patient's opinion after the examination`
    const title18En = `Protecting the patient's rights when going to the doctor`
    const title19En = `Need to learn more?`
    const title20En = `Protecting the patient's rights when going to the doctor`
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div className='background-role-booking'>
                <div className='role-booking-container container'>
                    <div className='role-booking-care'
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>
                            {language === LANGUAGES.VI ? title1Vi : title1En}
                        </span>
                        <i
                            className={isOpen === true ? "fas fa-caret-up" : "fas fa-caret-down"}
                        ></i>
                    </div>
                    {isOpen === true &&
                        <div className='role-content'>
                            <b>
                                {language === LANGUAGES.VI ? title2Vi : title2En}.
                            </b>
                            <ul>
                                <li>
                                    {language === LANGUAGES.VI ? title3Vi : title3En}.
                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title4Vi : title4En}.
                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title5Vi : title5En}.
                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title6Vi : title6En}.
                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title7Vi : title7En}.
                                </li>
                            </ul>
                            <b>
                                {language === LANGUAGES.VI ? title8Vi : title8En}.
                            </b><br />
                            <span>
                                {language === LANGUAGES.VI ? title9Vi : title9En}.
                            </span>
                            <ul>
                                <li>
                                    {language === LANGUAGES.VI ? title10Vi : title10En}.

                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title11Vi : title11En}.


                                </li>
                            </ul>
                            <span>
                                {language === LANGUAGES.VI ? title12Vi : title12En}.


                            </span>
                            <ul>
                                <li>
                                    {language === LANGUAGES.VI ? title13Vi : title13En}.

                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title14Vi : title14En}.

                                </li>
                            </ul>
                            <span>
                                {language === LANGUAGES.VI ? title15Vi : title15En}.


                            </span>
                            <ul>
                                <li>
                                    {language === LANGUAGES.VI ? title16Vi : title16En}.

                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title17Vi : title17En}.

                                </li>
                                <li>
                                    {language === LANGUAGES.VI ? title18Vi : title18En}.

                                </li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
            <div className='support-question'>
                <div className='container'>
                    <span className='title1'>
                        {language === LANGUAGES.VI ? title19Vi : title19En}.

                    </span>
                    <span className='title2'>
                        {language === LANGUAGES.VI ? title20Vi : title20En}.

                    </span>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleBookingCare);
