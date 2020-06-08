export const init = ( account => {
    return {
        type: 'INIT_ACCOUNT',
        account
    }
});

export const logout = () => {
    return {
        type: 'LOG_OUT'
    }
}