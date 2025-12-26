export const ADMIN_API_ROUTE = {
    ADMIN_SIGNIN : '/admin/signin',
    ADMIN_LOGOUT : '/admin/logout',
    EXAM_CREATE : '/exam/create-exam',
    GET_ALL_EXAMS : '/exam/get-exams',
    GET_EXAM : (examId:number) =>  `/exam/get-exam/${examId}`,
    ADD_QUESTIONS : '/question/add-question'
}