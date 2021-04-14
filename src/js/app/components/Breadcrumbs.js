import React, {useEffect} from 'react'
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import breadcrumbs from "../../redux/reducers/breadcrumbs";
import {setBreadcrumbs, setNameString} from "../../redux/actions";

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,

        '& span': {
            marginBottom: 0,
            marginRight: 5
        }
    },
    link: {
        color: theme.palette.primary.contrastText,
        textDecoration: "none"
    }
}));

function Breadcrumbs(props) {
    const classes = useStyles();

    const {breadcrumbs, setBreadcrumbs, setNameString} = props;

    useEffect(() => {
        console.log(breadcrumbs)
    }, [breadcrumbs])

    return <div className={"breadcrumbs " + classes.breadcrumbs}>
        {breadcrumbs && breadcrumbs.map((b, i) => <React.Fragment key={`/fragment-${b.id || ''}`}>
            {i !== 0 && <Typography variant="overline" gutterBottom className="separator">></Typography>}
            <Link onClick={() => {
                setBreadcrumbs(breadcrumbs.slice(0, i + 1))
            }}
                  to={`/${b.id || ''}`} className={classes.link} key={`/${b.id || ''}`}>
                <Typography variant="overline" gutterBottom>{b.id === null ? "Главная" : b.name}</Typography>
            </Link>
        </React.Fragment>)}
    </div>
}

Breadcrumbs.propTypes = {
    breadcrumbs: PropTypes.array,
    setBreadcrumbs: PropTypes.func,
    setNameString: PropTypes.func,
}
const mapStateToProps = (state) => ({
    breadcrumbs: state.breadcrumbs,
})
const mapDispatchToProps = (dispatch) => ({
    setBreadcrumbs: breadcrumbs => dispatch(setBreadcrumbs(breadcrumbs)),
    setNameString: nameString => dispatch(setNameString(nameString))
});


export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs)