export const init = ( logged => {
    return {
        type: 'INIT_ACCOUNT',
        logged
    }
});

export const logout = () => {
    return {
        type: 'LOG_OUT'
    }
}