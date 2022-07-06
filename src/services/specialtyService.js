import axios from '../axios'

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}

const getAllSpecialty = (type) => {
    if (!type) {
        type = 'ALL'
    }
    return axios.get(`/api/get-all-specialty?type=${type}`)
}

const getDetailSpecialty = (inputId) => {
    return axios.get(`/api/get-detail-specialty?id=${inputId}`)
}


export {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialty
}