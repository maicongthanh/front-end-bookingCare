export const path = {
    HOME: '/',
    HOMEPAGE: '/home',
    LOGIN: '/login',
    LOG_OUT: '/logout',
    SYSTEM: '/system',
    HELLO_ADMIN: '/system/hello-admin',
    DETAIL_DOCTOR: '/detail-doctor/:id',
    SCHEDULE_DOCTOR: '/doctor',
    VERIFY_EMAIL_BOOKING: '/verify-booking',
    VERIFY_FORGOT_PASSWORD: '/verify-forgot-password',
    DETAIL_CLINIC: '/detail-clinic/:id',
    DETAIL_SPECIALTY: '/detail-specialty/:id',
    ALL_DOCTOR: '/all-doctor',
    ALL_SPECIALTY: '/all-specialty',
    ALL_CLINIC: '/all-clinic',
    DETAIL_PROFILE: '/system/profile',
    DETAIL_POSTS: '/detail-posts/:id'
};

export const LANGUAGES = {
    VI: 'vi',
    EN: 'en'
};

export const CRUD_ACTIONS = {
    CREATE: "CREATE",
    EDIT: "EDIT",
    DELETE: "DELETE",
    READ: "READ"
};

export const USER_ROLE = {
    ADMIN: 'R1',
    DOCTOR: 'R2',
    PATIENT: 'R3'
}

export const TODAY = {
    valueVi: ' Hôm nay ',
    valueEn: ' Today '
}

export const customStyles = {
    option: (styles, state) => ({
        ...styles,
        cursor: 'pointer',
    }),
    control: (styles) => ({
        ...styles,
        cursor: 'pointer',
    }),
}

export const STATUS = {
    NEW: 'S1',
    CONFIRM: 'S2',
    DONE: 'S3',
    CANCEL: 'S4'
}