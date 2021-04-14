import {actions} from "../actions";

const nameString = (state = null, action) => {
    switch (action.type) {
        case actions.SET_NAME_STRING:
            return action.nameString
        default:
            return state;
    }
}

export default nameString