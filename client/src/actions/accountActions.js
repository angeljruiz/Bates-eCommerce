export const init = ( loggedIn => {
    return {
        type: 'INIT_ACCOUNT',
        loggedIn
    }
});

export const logout = () => {
    return {
        type: 'LOG_OUT'
    }
}