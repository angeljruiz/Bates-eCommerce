const accountDefaultState = { loggedIn: false };

export default (state = accountDefaultState, {loggedIn, type}) => {
    switch(type) {
        case 'INIT_ACCOUNT':
            return { loggedIn };
        case 'LOG_OUT':
            return { loggedIn: false }
        default:
            return state
    }
}