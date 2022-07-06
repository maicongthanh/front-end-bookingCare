import axios from '../axios'

const getAllClinic = (type) => {
    if (!type) {
        type = 'ALL'
    }
    return axios.get(`/api/get-all-clinic?type=${type}`)
}

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}

const getDetailClinic = (inputId) => {
    return axios.get(`/api/get-detail-clinic?id=${inputId}`,)
}

const searchClinicByString = (data) => {
    if (!data.limit) {
        data.limit = +4
    }
    return axios.get(`/api/search-clinic-by-string?q=${encodeURIComponent(data.q)}&limit=${data.limit}`)
}

export {
    getAllClinic,
    createNewClinic,
    getDetailClinic,
    searchClinicByString
}