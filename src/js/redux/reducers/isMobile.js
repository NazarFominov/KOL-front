import {actions} from "../actions";
import {checkIsMobile} from "../../app/controls/SimpleFunctions";

const isMobile = (state = checkIsMobile(), action) => {
    switch (action.type) {
        case actions.SET_IS_MOBILE:
            return action.isMobile
        default:
            return state;
    }
}

export default isMobile