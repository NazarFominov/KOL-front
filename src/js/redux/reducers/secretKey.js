import {actions} from "../actions";

const secretKey = (state = null, action) => {
    switch (action.type) {
        case actions.SET_SECRET_KEY:
            return action.secretKey
        default:
            return state;
    }
}

export default secretKey