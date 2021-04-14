import {actions} from "../actions";

const breadcrumbs = (state = [], action) => {
    switch (action.type) {
        case actions.SET_BREADCRUMBS:
            return action.breadcrumbs
        default:
            return state;
    }
}

export default breadcrumbs