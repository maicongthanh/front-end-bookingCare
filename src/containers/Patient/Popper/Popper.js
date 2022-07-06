/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './Popper.scss';

const Popper = (props) => {


    return (
        <>

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

export default connect(mapStateToProps, mapDispatchToProps)(Popper);
