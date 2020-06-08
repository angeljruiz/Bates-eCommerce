const accountDefaultState = { account: false };

export default (state = accountDefaultState, {account, type}) => {
    switch(type) {
        case 'INIT_ACCOUNT':
            return { account };
        case 'LOG_OUT':
            return { account: false }
        default:
            return state
    }
}