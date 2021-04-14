import {actions} from "../actions";

const ip = (state = "", action) => {
    switch (action.type) {
        case actions.SET_IP:
            return action.ip
        default:
            return state;
    }
}

export default ip