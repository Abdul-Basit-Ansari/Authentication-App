export const reducer = (state, action) => {

    switch (action.type) {
        
        case "USER_PROFILE": {
            return { ...state, user: action.payload }
        }
        case "USER_LOGIN": {
            return { ...state, loginToken: action.payload, isLogin: true }
        }
        case "USER_LOGOUT": {
            return { ...state, loginToken:"" ,  user: null, isLogin: false }
        }
        default: {
            return state
        }
    }
}