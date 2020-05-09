const accountDefaultState = { logged: 'false' };

export default (state = accountDefaultState, {logged, type}) => {
    switch(type) {
        case 'INIT_ACCOUNT':
            return {logged};
        case 'LOG_OUT':
            console.log('logging out')
            return { logged: 'false' }
        default:
            return state
    }
}