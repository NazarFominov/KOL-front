import {actions} from "../actions";

const favoritesList = (state = [], action) => {
    switch (action.type) {
        case actions.SET_FAVORITES_LIST:
            return action.favoritesList
        default:
            return state;
    }
}

export default favoritesList