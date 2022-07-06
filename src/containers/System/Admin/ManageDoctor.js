/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss'
import * as actions from '../../../store/actions'
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils/constant'
import { detailDoctorClinicSpecialty, postDetailDoctorMarkdown } from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { getDetailInforDoctor, getAllCodeApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import { getAllSpecialty } from '../../../services/specialtyService';
import { getAllClinic } from '../../../services/clinicService';

const ManageDoctor = (props) => {
    const { fetchAllDoctor, listDoctorsRedux, language } = props
    const [listDoctors, setListDoctors] = useState([])
    const [list, setList] = useState({
        selectedPrice: '',
        selectedPayment: '',
        selectedProvince: '',
        selectedSpecialty: '',
        selectedClinic: '',
        noteVi: '',
        noteEn: '',

        listPrice: [],
        listPayment: [],
        listProvince: [],
        listSpecialty: [],
        listClinic: [],
    })
    const { listPrice, listPayment, listProvince, listSpecialty, listClinic,
        selectedPrice,
        selectedPayment,
        selectedProvince,
        selectedSpecialty,
        selectedClinic,
        noteVi,
        noteEn,
    } = list

    useEffect(() => {
        fetchAllDoctor()
    }, [language])

    useEffect(() => {
        fetchAllData()
    }, [language])

    const fetchAllData = async () => {
        let resPrice = await getAllCodeApi("PRICE")
        let resPayMent = await getAllCodeApi("PAYMENT")
        let resProvince = await getAllCodeApi("PROVINCE")
        let resSpecialty = await getAllSpecialty()
        let resClinic = await getAllClinic()
        if (
            resPrice && resPrice.errCode === 0 &&
            resPayMent && resPayMent.errCode === 0 &&
            resProvince && resProvince.errCode === 0 &&
            resSpecialty && resSpecialty.errCode === 0 &&
            resClinic && resClinic.errCode === 0
        ) {
            let dataSelectPrice = buildDataInputSelectAllCode(resPrice.data)
            let dataSelectPayment = buildDataInputSelectAllCode(resPayMent.data)
            let dataSelectProvince = buildDataInputSelectAllCode(resProvince.data)
            let dataSelectSpecialty = buildDataInputSpecialtyClinic(resSpecialty.data)
            let dataSelectClinic = buildDataInputSpecialtyClinic(resClinic.data)
            setList({
                ...list,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,

            })
        }
    }

    useEffect(() => {
        let dataSelect = buildDataInputSelect(listDoctorsRedux)
        setListDoctors(dataSelect)
    }, [listDoctorsRedux, language])

    const [state, setState] = useState({
        contentHTMLVi: '',
        contentMarkdownVi: '',
        descriptionVi: '',
        contentHTMLEn: '',
        contentMarkdownEn: '',
        descriptionEn: '',
        selectedDoctor: '',
        doctorId: '',
        hasOldData: false
    })

    const {
        contentHTMLVi, contentMarkdownVi, descriptionVi,
        contentHTMLEn, contentMarkdownEn, descriptionEn,
        selectedDoctor, hasOldData
    } = state

    const mdParser = new MarkdownIt();
    const handleEditorChangeVi = ({ html, text }) => {
        setState({
            ...state,
            contentHTMLVi: html,
            contentMarkdownVi: text,
        })
    }
    const handleEditorChangeEn = ({ html, text }) => {
        setState({
            ...state,
            contentHTMLEn: html,
            contentMarkdownEn: text,
        })
    }

    const handleChangeSelect = async (selectedDoctor) => {
        setState({
            ...state,
            selectedDoctor
        });
        let res = await getDetailInforDoctor(selectedDoctor.value)
        let res1 = await detailDoctorClinicSpecialty(selectedDoctor.value)
        if (res && res.errCode === 0 && res.data
            && res.data.Markdown &&
            res1 && res1.errCode === 0 && res1.data &&
            res1.data.clinicTypeData && res1.data.paymentTypeData && res1.data.priceTypeData &&
            res1.data.provinceTypeData && res1.data.provinceTypeData && res1.data.specialtyTypeData
        ) {
            let markdown = res.data.Markdown
            let data = res1.data
            let checkLanguage = language === LANGUAGES.VI
            setState({
                ...state,
                // doctorId: selectedDoctor.value,
                selectedDoctor,
                contentHTMLVi: markdown.contentHTMLVi,
                contentMarkdownVi: markdown.contentMarkdownVi,
                descriptionVi: markdown.descriptionVi,
                contentHTMLEn: markdown.contentHTMLEn,
                contentMarkdownEn: markdown.contentMarkdownEn,
                descriptionEn: markdown.descriptionEn,
                hasOldData: true
            })
            setList({
                ...list,
                selectedPrice: { label: checkLanguage ? data.priceTypeData.valueVi : data.priceTypeData.valueEn, value: data.priceId },
                selectedPayment: { label: checkLanguage ? data.paymentTypeData.valueVi : data.paymentTypeData.valueEn, value: data.paymentId },
                selectedProvince: { label: checkLanguage ? data.provinceTypeData.valueVi : data.provinceTypeData.valueEn, value: data.provinceId },
                selectedSpecialty: { label: checkLanguage ? data.specialtyTypeData.nameVi : data.specialtyTypeData.nameEn, value: data.specialtyId },
                selectedClinic: { label: checkLanguage ? data.clinicTypeData.nameVi : data.clinicTypeData.nameEn, value: data.clinicId, address: checkLanguage ? data.clinicTypeData.addressVi : data.clinicTypeData.addressEn },
                noteVi: data.noteVi,
                noteEn: data.noteEn,
            })
        } else {
            setState({
                ...state,
                // doctorId: selectedDoctor.value,
                selectedDoctor,
                contentHTMLVi: '',
                contentMarkdownVi: '',
                descriptionVi: '',
                contentHTMLEn: '',
                contentMarkdownEn: '',
                descriptionEn: '',
                hasOldData: false
            })
            setList({
                ...list,
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
                noteVi: '',
                noteEn: '',
            })
        }
    };
    const handleOnchangeInforDoctor = (event) => {
        const { name, value } = event.target
        setState({
            ...state,
            [name]: value
        })
        setList({
            ...list,
            [name]: value
        })
    }

    const buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.firstName} ${item.lastName}`
                let labelEn = `${item.lastName} ${item.firstName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                result.push(object)
            })
        }
        return result;
    }
    const buildDataInputSelectAllCode = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.valueVi}`
                let labelEn = `${item.valueEn}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result;
    }
    const buildDataInputSpecialtyClinic = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.nameVi}`
                let labelEn = `${item.nameEn}`
                let addressVi = `${item.addressVi}`
                let addressEn = `${item.addressEn}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn
                object.value = item.id
                object.address = language === LANGUAGES.VI ? addressVi : addressEn
                result.push(object)
            })
        }
        return result;
    }

    const handleSelectAllCode = (value, name) => {
        let copyList = { ...list }
        copyList[name] = value
        setList({
            ...copyList,
        })
    }
    const handleSaveMarkdown = async () => {
        let res = await postDetailDoctorMarkdown({
            doctorId: selectedDoctor.value,
            contentHTMLVi: contentHTMLVi,
            contentMarkdownVi: contentMarkdownVi,
            descriptionVi: descriptionVi,
            contentHTMLEn: contentHTMLEn,
            contentMarkdownEn: contentMarkdownEn,
            descriptionEn: descriptionEn,

            priceId: selectedPrice.value,
            paymentId: selectedPayment.value,
            provinceId: selectedProvince.value,
            specialtyId: selectedSpecialty.value,
            clinicId: selectedClinic.value,
            noteVi: noteVi,
            noteEn: noteEn,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
        })
        if (res && res.errCode === 0) {
            language === LANGUAGES.VI ? toast.success('Lưu thông tin thành công !') : toast.success('Save Information success !')
            setState({
                ...state,
                doctorId: '',
                selectedDoctor: '',
                contentHTMLVi: '',
                contentMarkdownVi: '',
                descriptionVi: '',
                contentHTMLEn: '',
                contentMarkdownEn: '',
                descriptionEn: '',
                hasOldData: false
            })
            setList({
                ...list,
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
                noteVi: '',
                noteEn: '',
            })
        } else {
            language === LANGUAGES.VI ? toast.error('Vui lòng điền đầy đủ thông tin !') : toast.error('Please enter the full information !')
        }
    }
    return (
        <div className='manage-doctor-container'>
            <div className='title'>
                <FormattedMessage id="admin.manage-doctor.title" />
            </div>
            <div className='row mb-3'>
                <div className="col-4">
                    <label>
                        <FormattedMessage id="admin.manage-doctor.choose-doctor" />
                    </label>
                    <Select
                        value={selectedDoctor}
                        onChange={handleChangeSelect}
                        options={listDoctors}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.price" />
                    </label>
                    <Select
                        value={selectedPrice}
                        onChange={(selectedPrice) => handleSelectAllCode(selectedPrice, 'selectedPrice')}
                        options={listPrice}
                        name='selectedPrice'

                    />
                </div>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.payment" />

                    </label>
                    <Select
                        value={selectedPayment}
                        name='selectedPayment'
                        onChange={(selectedPayment) => handleSelectAllCode(selectedPayment, 'selectedPayment')}
                        options={listPayment}
                    />
                </div>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.province" />
                    </label>
                    <Select
                        value={selectedProvince}
                        onChange={(selectedProvince) => handleSelectAllCode(selectedProvince, 'selectedProvince')}
                        options={listProvince}
                    />
                </div>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.specialty" />
                    </label>
                    <Select
                        value={selectedSpecialty}
                        onChange={(selectedSpecialty) => handleSelectAllCode(selectedSpecialty, 'selectedSpecialty')}

                        options={listSpecialty}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.clinic" />

                    </label>
                    <Select
                        value={selectedClinic}
                        onChange={(selectedClinic) => handleSelectAllCode(selectedClinic, 'selectedClinic')}

                        options={listClinic}
                    />
                </div>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.address-clinic" />
                    </label>
                    <input
                        type="text"
                        value={selectedClinic ? selectedClinic.address : ''}
                        className="form-control"
                        readOnly
                    />
                </div>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.noteVi" />
                    </label>
                    <input type="text" className='form-control'
                        onChange={(event) => handleOnchangeInforDoctor(event)}
                        value={noteVi}
                        name='noteVi'
                    />
                </div>
                <div className='col-3 form-group'>
                    <label>
                        <FormattedMessage id="admin.manage-doctor.noteEn" />
                    </label>
                    <input type="text" className='form-control'
                        onChange={(event) => handleOnchangeInforDoctor(event)}
                        value={noteEn}
                        name='noteEn'
                    />
                </div>
            </div>
            <div className='manage-doctor-editor'>
                <div className='content-vi'>
                    <div className='up'>
                        <div className='select'>
                        </div>
                        <div className='more-infor mb-3'>
                            <div className='infor-markdown'>
                                <FormattedMessage id="admin.manage-doctor.introVi" />

                            </div>
                            <textarea
                                className='form-control'
                                rows={5}
                                value={descriptionVi}
                                name='descriptionVi'
                                onChange={(event) => handleOnchangeInforDoctor(event)}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className='down'>
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={handleEditorChangeVi}
                            value={contentMarkdownVi}
                        />
                    </div>
                </div>
                <div className='content-en mt-5'>
                    <div className='up'>
                        <div className='select'>
                        </div>
                        <div className='more-infor mb-3'>
                            <div className='infor-markdown'>
                                <FormattedMessage id="admin.manage-doctor.introEn" />
                            </div>
                            <textarea
                                className='form-control'
                                rows={5}
                                value={descriptionEn}
                                name='descriptionEn'
                                onChange={(event) => handleOnchangeInforDoctor(event)}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className='down'>
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={handleEditorChangeEn}
                            value={contentMarkdownEn}

                        />
                    </div>
                </div>

                <button
                    onClick={handleSaveMarkdown}
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                >
                    {hasOldData === true ?
                        <FormattedMessage id="admin.manage-doctor.edit" />
                        :
                        <FormattedMessage id="admin.manage-doctor.create" />
                    }

                </button>
            </div>
        </div>


    )
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        listDoctorsRedux: state.admin.listDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
