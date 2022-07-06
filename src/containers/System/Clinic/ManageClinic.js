/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { connect } from 'react-redux';
import './ManageClinic.scss'
import { CRUD_ACTIONS, LANGUAGES, customStyles } from '../../../utils/constant'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { CommonUtils } from '../../../utils';
import { createNewClinic, getAllClinic, getDetailClinic } from '../../../services/clinicService';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
const ManageClinic = (props) => {
    const mdParser = new MarkdownIt();
    const { language } = props

    const [state, setState] = useState({
        image: '', background: '', fileImage: '', fileBackground: '',
        nameVi: '', addressVi: '', descriptionHTMLVi: '', descriptionMarkdownVi: '',
        nameEn: '', addressEn: '', descriptionHTMLEn: '', descriptionMarkdownEn: '',
        hasOldData: false, selectedClinic: '', listClinic: [], isOpenImage: false, isOpenBackground: false
    })

    let { image, background,
        nameVi, addressVi, descriptionMarkdownVi,
        nameEn, addressEn, descriptionMarkdownEn,
        hasOldData, selectedClinic, listClinic, isOpenImage, isOpenBackground
    }
        = state

    useEffect(() => {
        fetchAllClinic()
    }, [language])

    const fetchAllClinic = async () => {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            let dataSelect = buildDataInputSelect(res.data)
            setState({
                ...state,
                listClinic: dataSelect,
                image: '', background: '', fileImage: '', fileBackground: '',
                nameVi: '', addressVi: '', descriptionHTMLVi: '', descriptionMarkdownVi: '',
                nameEn: '', addressEn: '', descriptionHTMLEn: '', descriptionMarkdownEn: '',
                selectedClinic: '', hasOldData: false
            })
        }
    }

    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.nameVi}`
                let labelEn = `${item.nameEn}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
        return result;
    }

    const handleChangeSelect = async (selectedClinic) => {
        setState({
            ...state,
            selectedClinic
        })
        let res = await getDetailClinic(selectedClinic.value)
        if (res && res.errCode === 0) {
            let data = res.data
            let imageBase64 = ''
            let backgroundBase64 = ''
            if (data.image && data.background) {
                imageBase64 = Buffer.from(data.image, 'base64').toString('binary')
                backgroundBase64 = Buffer.from(data.background, 'base64').toString('binary');
            }
            setState({
                ...state,
                selectedClinic,
                image: imageBase64,
                background: backgroundBase64,
                fileImage: imageBase64,
                fileBackground: backgroundBase64,
                nameVi: data.nameVi,
                addressVi: data.addressVi,
                descriptionHTMLVi: data.descriptionHTMLVi,
                descriptionMarkdownVi: data.descriptionMarkdownVi,
                nameEn: data.nameEn,
                addressEn: data.addressEn,
                descriptionHTMLEn: data.descriptionHTMLEn,
                descriptionMarkdownEn: data.descriptionMarkdownEn,
                hasOldData: true,
            })
        }
    }


    const handleEditorChangeVi = ({ html, text }) => {
        setState({
            ...state,
            descriptionHTMLVi: html,
            descriptionMarkdownVi: text,
        })
    }
    const handleEditorChangeEn = ({ html, text }) => {
        setState({
            ...state,
            descriptionHTMLEn: html,
            descriptionMarkdownEn: text,
        })
    }

    const handleOnchangeInput = (event) => {
        const { name, value } = event.target
        setState({
            ...state,
            [name]: value
        })
    }

    const handleOnchangeInputImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file) //Blob
            setState({
                ...state,
                image: objectUrl,
                fileImage: base64
            })
        }
    }

    const handleOnchangeInputBackground = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setState({
                ...state,
                background: objectUrl,
                fileBackground: base64
            })
        }
    }

    const checkValidInput = (inputData) => {
        let arrFields = ['image', 'background', 'fileImage', 'fileBackground',
            'nameVi', 'addressVi', 'descriptionHTMLVi', 'descriptionMarkdownVi',
            'nameEn', 'addressEn', 'descriptionHTMLEn', 'descriptionMarkdownEn',
        ]
        let isValid = true;
        for (let i = 0; i < arrFields.length; i++) {
            if (!inputData[arrFields[i]]) {
                isValid = false
                break;
            }
        }
        return isValid
    }

    const handleOpenPrevImage = () => {
        if (!image) {
            return;
        }
        setState({
            ...state,
            isOpenImage: true,
        })
    }

    const handleOpenPrevBackground = () => {
        if (!background) {
            return;
        }
        setState({
            ...state,
            isOpenBackground: true,
        })
    }



    const handleSubmit = async () => {
        let isValid = checkValidInput(state)
        if (!isValid) {
            language === LANGUAGES.VI ? toast.error('Vui lòng nhập đầy đủ thông tin !') : toast.error('Please enter full information !')
        } else {
            if (hasOldData === true) {
                let res = await createNewClinic({
                    ...state,
                    action: CRUD_ACTIONS.EDIT,
                    id: selectedClinic.value,
                })
                if (res && res.errCode === 0) {
                    language === LANGUAGES.VI ? toast.success('Cập nhật phòng khám thành công !') : toast.success('Update clinic success !')
                    fetchAllClinic()
                }
            } else {
                let res = await createNewClinic({
                    ...state,
                    action: CRUD_ACTIONS.CREATE
                })
                if (res && res.errCode === 0) {
                    language === LANGUAGES.VI ? toast.success(' Tạo phòng khám thành công !') : toast.success('Create new clinic success !')
                    fetchAllClinic()
                }
            }
        }
    }


    return (
        <div className='manage-clinic-container container'>
            <div className="title">Quản lý phòng khám</div>
            <div className='row mb-5'>
                <div className='col-4'>
                    <Select
                        value={selectedClinic}
                        onChange={handleChangeSelect}
                        options={listClinic}
                        styles={customStyles}
                    />
                </div>
            </div>
            <div className="row">
                <div className='col-4 form-group'>
                    <label >Tên phòng khám (Tiếng Việt)</label>
                    <input type="text" className="form-control"
                        value={nameVi}
                        onChange={(event) => handleOnchangeInput(event)}
                        name="nameVi"
                    />
                </div>
                <div className='col-4 form-group'>
                    <label >Tên phòng khám (Tiếng Anh)</label>
                    <input type="text" className="form-control"
                        onChange={(event) => handleOnchangeInput(event)}
                        name="nameEn"
                        value={nameEn}
                    />
                </div>
                <div className='col-4 form-group content-image'>
                    <label htmlFor='image-avatar' className='image-avatar'>
                        <span>Ảnh đại diện</span>
                        <i className="fas fa-upload"></i>
                    </label>
                    <input type="file" id='image-avatar' hidden
                        onChange={(event) => handleOnchangeInputImage(event)}
                    />
                    <div className='prev-image'
                        style={{
                            backgroundImage: `url(${image})`,
                        }}
                        onClick={handleOpenPrevImage}
                    >
                    </div>
                </div>
                {isOpenImage === true &&
                    <Lightbox
                        mainSrc={image}
                        onCloseRequest={() => setState({ ...state, isOpenImage: false })}
                    />
                }

            </div>
            <div className="row">
                <div className='col-4 form-group'>
                    <label >Địa chỉ phòng khám (Tiếng Việt)</label>
                    <input type="text" className="form-control"
                        value={addressVi}
                        onChange={(event) => handleOnchangeInput(event)}
                        name="addressVi"
                    />
                </div>
                <div className='col-4 form-group'>
                    <label >Địa chỉ phòng khám (Tiếng Anh)</label>
                    <input type="text" className="form-control"
                        onChange={(event) => handleOnchangeInput(event)}
                        name="addressEn"
                        value={addressEn}
                    />
                </div>
                <div className='col-4 form-group content-image'>
                    <label htmlFor='image-background' className='image-avatar'>
                        <span>Ảnh nền</span>
                        <i className="fas fa-upload"></i>
                    </label>
                    <input type="file" id='image-background' hidden
                        onChange={(event) => handleOnchangeInputBackground(event)}
                    />
                    <div className='prev-image'
                        style={{
                            backgroundImage: `url(${background})`,
                        }}
                        onClick={handleOpenPrevBackground}
                    >
                    </div>
                    {isOpenBackground === true &&
                        <Lightbox
                            mainSrc={background}
                            onCloseRequest={() => setState({ ...state, isOpenBackground: false })}
                        />
                    }
                </div>
            </div>
            <div className="row mb-5">
                <div className='col-12'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={handleEditorChangeVi}
                        value={descriptionMarkdownVi}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className='col-12'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={handleEditorChangeEn}
                        value={descriptionMarkdownEn}
                    />
                </div>
            </div>
            <div className='row mb-5'>
                <div className="col-12">
                    <button
                        className={hasOldData ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                        onClick={() => handleSubmit()}
                    >
                        Lưu thông tin
                    </button>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
