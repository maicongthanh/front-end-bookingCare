import { connect } from 'react-redux';
import './Popper.scss';

const Wrapper = ({ children }) => {
    return (
        <div className='wrapper'>
            {children}
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

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
