/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import { connect } from 'react-redux';
// import './WelcomeAdmin.scss'

const WelcomeAdmin = (props) => {
    return (
        <div className='title'>
            Chào mừng bạn đến trang quản lý , chúc bạn có 1 ngày làm việc tốt lành
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeAdmin);
