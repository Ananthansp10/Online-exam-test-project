export const USER_API_ROUTE = {
    USER_SIGNUP : '/user/signup',
    USER_SIGNIN : '/user/signin',
    USER_LOGOUT : '/user/logout',
    GET_QUESTIONS : (examId:number) => `/question/get-question/${examId}`
}