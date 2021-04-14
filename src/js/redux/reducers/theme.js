import {actions} from "../actions";

const currentTheme = (() => {
    try {
        const t = JSON.parse(localStorage.getItem('currentTheme'))
        return t ? t : 'nazar';
    } catch (e) {
        return "nazar"
    }
})()

const theme = (state = currentTheme, action) => {
    switch (action.type) {
        case actions.SET_THEME:
            try {
                localStorage.setItem("currentTheme", JSON.stringify(action.theme))
            } catch (e) {
                console.log("NOT LOCAL STORAGE")
            }
            return action.theme
        default:
            return state;
    }
}

export default theme