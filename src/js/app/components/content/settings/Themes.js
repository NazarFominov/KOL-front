import React from 'react'
import {themes} from "../../../controls/constants/themes";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {setTheme} from "../../../../redux/actions";
import {connect} from "react-redux";

const useStyles = makeStyles((theme) => ({
    themesTitle: {
        marginTop: 0
    },

    themesBlock: {
        display: "flex",
        flexWrap: 'wrap'
    },
    theme: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        marginRight: 15,
        marginBottom: 15
    }
}));

function Themes({setTheme}) {
    const classes = useStyles()

    return <React.Fragment>
        <h4 className={classes.themesTitle}>Доступные темы</h4>
        <div className={classes.themesBlock}>
            {themes.map(t => <div onClick={() => setTheme(t.name)}
                                  style={{backgroundColor: t.theme.palette.primary.main}} className={classes.theme}/>)}
        </div>
    </React.Fragment>
}

Themes.propTypes = {
    setTheme: PropTypes.func,
}
const mapStateToProps = state => ({
    theme: state.theme
})
const mapDispatchToProps = (dispatch) => ({
    setTheme: theme => dispatch(setTheme(theme)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Themes)