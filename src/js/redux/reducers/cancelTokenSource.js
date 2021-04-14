import {actions} from "../actions";

const cancelTokenSource = (state = {}, action) => {
    switch (action.type) {
        case actions.cancelTokenSource.SET_CANCEL_TOKEN:
            return {...state, [action.cancelToken.name]: action.cancelToken}
        default:
            return state;
    }
}

export default cancelTokenSource