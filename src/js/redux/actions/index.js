export const actions = {
    SET_IP: "SET_IP",
    SET_THEME: "SET_THEME",
    SET_IS_MOBILE: "SET_IS_MOBILE",
    SET_ELEMENT_TYPES: "SET_ELEMENT_TYPES",
    SET_FAVORITES_LIST: "SET_FAVORITES_LIST",
    SET_LIST_TYPES: "SET_LIST_TYPES",
    SET_SECRET_KEY: "SET_SECRET_KEY",
    SET_DIALOG_MODAL: "SET_DIALOG_MODAL",
    SET_BREADCRUMBS: "SET_BREADCRUMBS",
    SET_NAME_STRING: "SET_NAME_STRING",
    cancelTokenSource: {
        SET_CANCEL_TOKEN: "SET_CANCEL_TOKEN"
    },
};

export const setIp = ip => ({
    type: actions.SET_IP,
    ip
})

export const setTheme = theme => ({
    type: actions.SET_THEME,
    theme
})

export const setIsMobile = isMobile => ({
    type: actions.SET_IS_MOBILE,
    isMobile
})

export const setTypes = types => ({
    type: actions.SET_ELEMENT_TYPES,
    types
})
export const setListTypes = types => ({
    type: actions.SET_LIST_TYPES,
    types
})

export const setSecretKey = secretKey => ({
    type: actions.SET_SECRET_KEY,
    secretKey
})
export const setDialogModal = dialogModal => ({
    type: actions.SET_DIALOG_MODAL,
    dialogModal
})
export const setBreadcrumbs = breadcrumbs => ({
    type: actions.SET_BREADCRUMBS,
    breadcrumbs
})
export const setNameString = nameString => ({
    type: actions.SET_NAME_STRING,
    nameString
})
export const setCancelToken = cancelToken => ({
    type: actions.cancelTokenSource.SET_CANCEL_TOKEN,
    cancelToken
})
export const setFavoritesList = favoritesList => ({
    type: actions.SET_FAVORITES_LIST,
    favoritesList
})