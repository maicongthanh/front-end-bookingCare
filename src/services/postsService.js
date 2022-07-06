import axios from '../axios'

const getAllPostsService = () => {
    return axios.get('/api/get-all-posts')
}

const createNewPostsService = (data) => {
    return axios.post('/api/post-new-posts', data)
}

const deletePostsService = (id) => {
    return axios.delete(`/api/delete-posts?id=${id}`)
}

const getDetailPost = (id) => {
    return axios.get(`/api/get-detail-posts?id=${id}`)
}

export {
    createNewPostsService,
    getAllPostsService,
    deletePostsService,
    getDetailPost
}