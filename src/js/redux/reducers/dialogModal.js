import {actions} from "../actions";

const dialogModal = (state = {}, action) => {
    switch (action.type) {
        case actions.SET_DIALOG_MODAL:
            return action.dialogModal
        default:
            return state;
    }
}

export default dialogModal