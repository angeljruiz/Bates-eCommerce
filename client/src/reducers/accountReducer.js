const accountDefaultState = { logged: 'false' };

export default (state = accountDefaultState, {logged, type}) => {
    switch(type) {
        case 'INIT_ACCOUNT':
            return {logged};
        case 'LOG_OUT':
            return { logged: 'false' }
        default:
            return state
    }
}