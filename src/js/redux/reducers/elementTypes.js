import {actions} from "../actions";

const elementTypes = (state = [], action) => {
    switch (action.type) {
        case actions.SET_ELEMENT_TYPES:
            return action.types
        default:
            return state;
    }
}

export default elementTypes