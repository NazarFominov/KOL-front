import {combineReducers} from 'redux'
import ip from "./ip";
import theme from "./theme";
import isMobile from "./isMobile";
import elementTypes from "./elementTypes";
import listTypes from "./listTypes";
import secretKey from "./secretKey";
import dialogModal from "./dialogModal";
import breadcrumbs from "./breadcrumbs";
import nameString from "./nameString";
import cancelTokenSource from "./cancelTokenSource";
import favoritesList from "./favoritesList";

export default combineReducers({
    ip,
    theme,
    isMobile,
    secretKey,
    listTypes,
    nameString,
    dialogModal,
    breadcrumbs,
    elementTypes,
    favoritesList,
    cancelTokenSource,
})
