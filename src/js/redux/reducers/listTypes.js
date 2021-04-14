import {actions} from "../actions";

const listTypes = (state = [], action) => {
    switch (action.type) {
        case actions.SET_LIST_TYPES:
            return action.types
        default:
            return state;
    }
}

export default listTypes