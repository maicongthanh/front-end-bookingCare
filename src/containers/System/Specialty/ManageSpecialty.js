/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { connect } from 'react-redux';
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { CommonUtils, CRUD_ACTIONS, LANGUAGES, customStyles } from '../../../utils';
import { createNewSpecialty, getAllSpecialty, getDetailSpecialty } from '../../../services/specialtyService';
const ManageSpecialty = (props) => {
    const mdParser = new MarkdownIt();

    const { language } = props
    const [listSpecialty, setListSpecialty] = useState([])
    const [state, setState] = useState({
        nameVi: '',
        nameEn: '',
        descriptionHTMLVi: '',
        descriptionMarkdownVi: '',
        descriptionHTMLEn: '',
        descriptionMarkdownEn: '',
        image: '',
        fileImage: '',
        selectedSpecialty: '',
        hasOldData: false
    })
    const { nameVi, nameEn, descriptionMarkdownVi,
        descriptionMarkdownEn, image, selectedSpecialty, hasOldData } = state


    useEffect(() => {
        fetchAllSpecialty()
    }, [])
    const fetchAllSpecialty = async () => {
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            let dataSelect = buildDataInputSelect(res.data)
            setListSpecialty(dataSelect)
        }
    }

    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                let labelVi = `${item.nameVi}`
                let labelEn = `${item.nameEn}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
        return result;
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

    const handleOnchangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setState({
                ...state,
                image: objectUrl,
                fileImage: base64
            })
        }
    }
    const handleChangeSelect = async (selectedSpecialty) => {
        setState({
            ...state,
            selectedSpecialty,
            hasOldData: true
        })
        let res = await getDetailSpecialty(selectedSpecialty.value)
        if (res && res.errCode === 0) {
            let data = res.data
            let imageBase64 = ''
            if (data && data.image) {
                imageBase64 = Buffer.from(data.image, 'base64').toString('binary');
            }
            setState({
                ...state,
                hasOldData: true,
                nameVi: data.nameVi,
                nameEn: data.nameEn,
                descriptionHTMLVi: data.descriptionHTMLVi,
                descriptionMarkdownVi: data.descriptionMarkdownVi,
                descriptionHTMLEn: data.descriptionHTMLEn,
                descriptionMarkdownEn: data.descriptionMarkdownEn,
                image: imageBase64,
                fileImage: imageBase64,
                selectedSpecialty
            })
        }
    }

    const checkValidInput = (inputData) => {
        let arrFields = ['image', 'fileImage',
            'nameVi', 'descriptionHTMLVi', 'descriptionMarkdownVi',
            'nameEn', 'descriptionHTMLEn', 'descriptionMarkdownEn',
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

    const handleSubmit = async () => {
        let isValid = checkValidInput(state)
        if (!isValid) {
            language === LANGUAGES.VI ? toast.error('Vui lòng nhập đầy đủ thông tin !') : toast.error('Please enter full information !')
        } else {
            if (hasOldData === true) {
                let res = await createNewSpecialty({
                    ...state,
                    action: CRUD_ACTIONS.EDIT,
                    id: selectedSpecialty.value
                })
                if (res && res.errCode === 0) {
                    language === LANGUAGES.VI ? toast.success('Cập nhật chuyên khoa thành công') : toast.success('Update specialty success')
                    setState({
                        ...state,
                        selectedSpecialty: '',
                        hasOldData: false,
                        nameVi: '',
                        nameEn: '',
                        descriptionHTMLVi: '',
                        descriptionMarkdownVi: '',
                        descriptionHTMLEn: '',
                        descriptionMarkdownEn: '',
                        image: '',
                        fileImage: ''
                    })
                    fetchAllSpecialty()
                }
            } else {
                let res = await createNewSpecialty({
                    ...state,
                    action: CRUD_ACTIONS.CREATE
                })
                if (res && res.errCode === 0) {
                    language === LANGUAGES.VI ? toast.success('Tạo chuyên khoa thành công') : toast.success('Create new a specialty success')
                    setState({
                        ...state,
                        selectedSpecialty: '',
                        hasOldData: false,
                        nameVi: '',
                        nameEn: '',
                        descriptionHTMLVi: '',
                        descriptionMarkdownVi: '',
                        descriptionHTMLEn: '',
                        descriptionMarkdownEn: '',
                        image: '',
                        fileImage: ''
                    })
                    fetchAllSpecialty()
                }
            }
        }

    }
    return (
        <div className='manage-specialty-container container'>
            <div className="title">Quản lý chuyên khoa</div>
            <div className='row mb-5'>
                <div className='col-4'>
                    <Select
                        value={selectedSpecialty}
                        onChange={handleChangeSelect}
                        options={listSpecialty}
                        styles={customStyles}

                    />
                </div>
            </div>
            <div className="row">
                <div className='col-4 form-group'>
                    <label >Tên chuyên khoa (Tiếng Việt)</label>
                    <input type="text" className="form-control"
                        onChange={(event) => handleOnchangeInput(event)}
                        name='nameVi'
                        value={nameVi}
                    />
                </div>
                <div className='col-4 form-group'>
                    <label >Tên chuyên khoa (Tiếng Anh)</label>
                    <input type="text" className="form-control"
                        onChange={(event) => handleOnchangeInput(event)}
                        name='nameEn'
                        value={nameEn}
                    />
                </div>
                <div className='col-4 form-group content-image'>
                    <label htmlFor='image-avatar' className="upload-image">
                        Ảnh đại diện
                        <i className="fas fa-upload"></i>
                    </label>
                    <input type="file" id='image-avatar' hidden
                        onChange={(event) => handleOnchangeImage(event)}
                    />
                    <div className='prev-image'
                        style={{
                            backgroundImage: `url(${image})`,
                        }}
                    >
                    </div>
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
                    <button className=

                        {hasOldData === true ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                        onClick={handleSubmit}
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
