import axios from '../axios'

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password })
}

const handleForgotPassword = (email) => {
    return axios.post('/api/forgot-password', email)
}

const handleChangePassword = (data) => {
    return axios.post('/api/change-password', data)
}

const verifyForgotPassword = (data) => {
    return axios.post('/api/verify-forgot-password', data)
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserApi = (id) => {
    return axios.delete(`/api/delete-user?id=${id}`)
}

const editUserApi = (data) => {
    return axios.put('/api/edit-user', data)
}

const getAllCodeApi = (inputData) => {
    return axios.get(`/api/get-allcode?type=${inputData}`)
}

const getTopDocTor = (limit, type) => {
    if (!limit) {
        limit = 10
    }
    if (!type) {
        type = 'ALL'
    }
    return axios.get(`/api/get-top-doctor?limit=${limit}&type=${type}`)
}

const getAllDoctors = () => {
    return axios.get('/api/get-all-doctor')
}

const postDetailDoctorMarkdown = (data) => {
    return axios.post('/api/save-infor-doctor', data)
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor?id=${inputId}`)
}

const detailDoctorClinicSpecialty = (inputId) => {
    return axios.get(`/api/get-detail-doctor-clinic-specialty?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getDetailScheduleDoctor = (data) => {
    return axios.get(`/api/get-detail-schedule?doctorId=${data.doctorId}&date=${data.date}`)
}

const deleteDetailSchedule = (inputData) => {
    return axios.delete(`/api/delete-schedule?id=${inputData}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const getDetailDistrictByProvince = (provinceId) => {
    return axios.get(`/api/get-detail-district-by-province?provinceId=${provinceId}`)
}

const getDetailClinicDoctorById = (doctorId) => {
    return axios.get(`/api/get-detail-clinic-doctor-by-id?doctorId=${doctorId}`)
}

const bookingCareAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}

const getDoctorWithSpecialtyAndLocationById = (specialtyId, provinceId) => {
    if (!provinceId) {
        provinceId = 'ALL'
    }
    return axios.get(`/api/get-doctor-with-specialty-and-location-by-id?specialtyId=${specialtyId}&provinceId=${provinceId}`)
}

const getDoctorWithClinicSpecialtyById = (clinicId, specialtyId) => {
    if (!specialtyId) {
        specialtyId = 'ALL'
    }
    return axios.get(`/api/get-doctor-with-clinic-and-specialty-by-id?clinicId=${clinicId}&specialtyId=${specialtyId}`)
}

const getAllAppointmentOfDoctor = (data) => {
    return axios.get(`/api/get-all-appointment-of-doctor?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId}`)
}

const sendRemedyService = (data) => {
    return axios.post(`/api/send-remedy`, data)
}

const getAllBillOfDoctor = (data) => {
    return axios.get(`/api/get-all-bill-of-doctor?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId}`)
}

const getAllBillWithWeekMonthOfDoctor = (data) => {
    return axios.get(`/api/get-all-bill-of-doctor-with-week-month?doctorId=${data.doctorId}&dateDay=${data.dateDay}&statusId=${data.statusId}&dateOfWeekMonth=${data.dateOfWeekMonth}`)
}

const searchDoctorByString = (data) => {
    if (!data.limit) {
        data.limit = +5
    }
    return axios.get(`/api/search-doctor-by-string?q=${encodeURIComponent(data.q)}&role=${data.role}&limit=${data.limit}`)
}

const searchUserByString = (data) => {
    if (!data.limit) {
        data.limit = +5
    }
    return axios.get(`/api/search-user-by-string?q=${encodeURIComponent(data.q)}&limit=${data.limit}`)
}

const testApi = () => {
    return axios.get(`/api/role/`)
}

const searchAllByString = (data) => {
    console.log(data);
    if (!data.limit) {
        data.limit = +5
    }
    return axios.get(`/api/search-all-string?q=${encodeURIComponent(data.q)}&role=${data.role}&limit=${data.limit}`)
}

export {
    handleLoginApi, handleChangePassword, handleForgotPassword, verifyForgotPassword, getAllUsers,
    createNewUserService, deleteUserApi,
    editUserApi, getAllCodeApi, getTopDocTor,
    getAllDoctors, postDetailDoctorMarkdown, getDetailInforDoctor,
    saveBulkScheduleDoctor,
    getDetailScheduleDoctor, deleteDetailSchedule, detailDoctorClinicSpecialty,
    getProfileDoctorById, getDetailDistrictByProvince, bookingCareAppointment, getDetailClinicDoctorById,
    postVerifyBookAppointment,
    getDoctorWithSpecialtyAndLocationById, getDoctorWithClinicSpecialtyById,
    getAllAppointmentOfDoctor, sendRemedyService, getAllBillOfDoctor, getAllBillWithWeekMonthOfDoctor,
    searchDoctorByString, searchUserByString, testApi,
    searchAllByString
}