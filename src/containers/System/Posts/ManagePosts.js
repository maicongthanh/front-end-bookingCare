/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import './ManagePost.scss'

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils, CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";
import { createNewPostsService, deletePostsService, getAllPostsService } from "../../../services/postsService";
const ManagePosts = (props) => {
    const mdParser = new MarkdownIt();
    const { language } = props
    const [isOpen, setIsOpen] = useState(false)

    const [listPosts, setListPosts] = useState([])
    const [state, setState] = useState({
        id: '',
        titleVi: '', contentHTMLVi: '', contentMarkdownVi: '',
        titleEn: '', contentHTMLEn: '', contentMarkdownEn: '',
        hasOldData: false,
        image: '', prevImage: ''
    })

    let {
        id,
        titleVi, contentHTMLVi, contentMarkdownVi,
        titleEn, contentHTMLEn, contentMarkdownEn,
        hasOldData,
        image, prevImage
    } = state


    const fetchAllPosts = async () => {
        let res = await getAllPostsService()
        if (res && res.errCode === 0) {
            setListPosts(res.data)
        }
    }

    useEffect(() => {
        fetchAllPosts()
    }, [])

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

    const handleOnchangeInput = (event) => {
        const { name, value } = event.target
        setState({
            ...state,
            [name]: value
        })
    }

    const handleOnChangeImage = async (event) => {
        let file = event.target.files[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setState({
                ...state,
                prevImage: objectUrl,
                image: base64
            })
        }
    }

    const checkValidInput = (inputData) => {
        let arrFields = [
            'titleVi', 'contentHTMLVi', 'contentMarkdownVi',
            'titleEn', 'contentHTMLEn', 'contentMarkdownEn',
            'image'
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

    const handleViewCreate = () => {
        setIsOpen(!isOpen)
        setState({
            ...state,
        })
    }

    const handleDelete = async (item) => {
        console.log(item.id);
        let res = await deletePostsService(item.id)
        if (res && res.errCode === 0) {
            language === LANGUAGES.VI ? toast.success('Xóa bài viết thành công !') : toast.success('Delete posts success !')
            fetchAllPosts()
        }
    }

    const handleUpdate = (item) => {
        let imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        setIsOpen(true)
        setState({
            ...state,
            hasOldData: true,
            id: item.id,
            titleVi: item.titleVi,
            titleEn: item.titleEn,
            contentHTMLVi: item.contentHTMLVi,
            contentMarkdownVi: item.contentMarkdownVi,
            contentHTMLEn: item.contentHTMLEn,
            contentMarkdownEn: item.contentMarkdownEn,
            prevImage: imageBase64,
            image: imageBase64
        })
    }

    const handleSubmit = async () => {
        let isValid = checkValidInput(state)
        if (!isValid) {
            language === LANGUAGES.VI ? toast.error('Vui lòng nhập đầy đủ thông tin !') : toast.error('Please enter full information !')
        } else {
            if (hasOldData === true) {
                let res = await createNewPostsService({
                    ...state,
                    action: CRUD_ACTIONS.EDIT,
                })
                if (res && res.errCode === 0) {
                    language === LANGUAGES.VI ? toast.success('Cập nhật bài viết thành công !') : toast.success('Update posts success !')
                    fetchAllPosts()
                    setState({
                        ...state,
                        hasOldData: false,
                        id: '',
                        titleVi: '', contentHTMLVi: '', contentMarkdownVi: '',
                        titleEn: '', contentHTMLEn: '', contentMarkdownEn: '',
                        image: '', prevImage: ''
                    })
                }
            } else {
                let res = await createNewPostsService({
                    ...state,
                    action: CRUD_ACTIONS.CREATE
                })
                if (res && res.errCode === 0) {
                    language === LANGUAGES.VI ? toast.success(' Tạo bài viết thành công !') : toast.success('Create new posts success !')
                    fetchAllPosts()
                    setState({
                        ...state,
                        hasOldData: false,
                        id: '',
                        titleVi: '', contentHTMLVi: '', contentMarkdownVi: '',
                        titleEn: '', contentHTMLEn: '', contentMarkdownEn: '',
                        image: '', prevImage: ''
                    })
                }
            }
        }
    }

    return (
        <div className="manage-posts-container container">
            <div className="manage-posts-title">
                Quản lý bài viết
            </div>
            <div className="row">
                <div className="col-12 mb-3">
                    <button className="btn btn-primary px-2"
                        onClick={() => handleViewCreate()}
                    >
                        <i className="fas fa-plus"></i>  Thêm mới bài viết
                    </button>
                </div>
            </div>
            {isOpen === true &&
                <>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Tiêu đề (Tiếng Việt)</label>
                            <input type="text" className="form-control"
                                onChange={handleOnchangeInput}
                                value={titleVi}
                                name='titleVi'
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Tiêu đề (Tiếng Anh)</label>
                            <input type="text" className="form-control"
                                onChange={handleOnchangeInput}
                                value={titleEn}
                                name='titleEn'
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 form-group avatar-content">
                            <label htmlFor="upload" className="label-upload">Hình ảnh <i className="fas fa-upload"></i></label>
                            <input type="file" id='upload' hidden
                                onChange={(event) => handleOnChangeImage(event)}
                            />
                            <div className="avatar"
                                style={{
                                    backgroundImage: `url(${prevImage})`
                                }}
                            >

                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Nội dung (Tiếng Việt)</label>
                            <MdEditor
                                style={{ height: '500px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={handleEditorChangeVi}
                                value={contentMarkdownVi}
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Nội dung (Tiếng Anh)</label>
                            <MdEditor
                                style={{ height: '500px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={handleEditorChangeEn}
                                value={contentMarkdownEn}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button
                                className={hasOldData === true ? "btn btn-warning px-2 mb-5" : "btn btn-primary px-2 mb-5"}
                                onClick={handleSubmit}
                            >
                                {hasOldData === true ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}
                            </button>
                        </div>
                    </div>
                </>
            }
            <div className="row">
                <div className="col-12">
                    <table id='TableManageSchedule'>
                        <tr>
                            <th>STT</th>
                            <th>Tiêu đề (Tiếng Việt)</th>
                            <th>Tiêu đề (Tiếng Anh)</th>
                            <th>Action</th>
                        </tr>
                        <tbody>
                            {listPosts && listPosts.length > 0 &&
                                listPosts.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.titleVi}</td>
                                            <td>{item.titleEn}</td>
                                            <td>
                                                <button
                                                    className='btn btn-warning'
                                                    onClick={() => handleUpdate(item)}
                                                >
                                                    <i className="fas fa-pencil-alt icon-pencil"></i>
                                                </button>
                                                <button
                                                    className='btn btn-danger'
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <i className="fas fa-trash icon-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePosts);