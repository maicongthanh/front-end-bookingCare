/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'react-redux';
import './RemedyModal.scss'
import localization from 'moment/locale/vi'
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { CommonUtils } from '../../../utils';
import { emitter } from '../../../utils/emitter';
const RemedyModal = (props) => {
    const { isOpenRemedy, dataModal, handleCloseModal, sendRemedy } = props

    const [state, setState] = useState({
        email: '',
        imageBase64: '',
        prevImage: ''
    })

    const { email, imageBase64, prevImage } = state

    useEffect(() => {
        setState({
            ...state,
            email: dataModal.email
        })
    }, [dataModal])

    const handleOnChangeEmail = (event) => {
        setState({
            ...state,
            email: event.target.value
        })
    }

    const handleOnchangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setState({
                ...state,
                prevImage: objectUrl,
                imageBase64: base64
            })
        }
    }

    const handleSendRemedy = () => {
        sendRemedy({
            email,
            imageBase64,
        })
    }
    emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
        setState({})
    })

    return (
        <Modal
            isOpen={isOpenRemedy}
            size='lg'
        >
            <ModalHeader toggle={handleCloseModal}>
                Thông tin gửi hóa đơn khám bệnh
            </ModalHeader>
            <ModalBody>
                <div className='row'>
                    <div className='col-6'>
                        <div className='form-group'>
                            <label>Email bệnh nhân</label>
                            <input
                                type='email'
                                value={email}
                                className='form-control'
                                onChange={(event) => handleOnChangeEmail(event)}

                            />
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='form-group'>
                            <label>Chọn File đơn thuốc</label>
                            <input
                                type='file'
                                className='form-control-file'
                                onChange={(event) => handleOnchangeImage(event)}
                            />
                        </div>
                        <div className='prev-image'
                            style={{
                                backgroundImage: `url(${prevImage})`
                            }}
                        >

                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={handleSendRemedy}
                    className='px-2'
                >
                    Xác nhận
                </Button>
                {' '}
                <Button
                    onClick={handleCloseModal}
                    className='px-2'
                >
                    Hủy
                </Button>
            </ModalFooter>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
