import React, {useState} from 'react';
import clsx from 'clsx';
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import {Add as AddBoxIcon} from "@material-ui/icons";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    element: {
        minHeight: 80,
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            backgroundColor: element => theme.palette.secondary.main,
            cursor: 'pointer'
        }
    },
    addButton: {
        width: '100%',
        height: '100%',
        padding: 0,
        color: theme.palette.primary.contrastText,

        '& span': {
            height: '100%'
        }
    },
    addIcon: {
        width: '5rem',
        height: '5rem',
    },
}));

function AddElement({onClick, fastFolder, fastElement}) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const openSubMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const  closeSunMenu = () => {
        setAnchorEl(null);
    };

    return <Box className={clsx("element", 'add-element', classes.element)}>
        <IconButton onClick={openSubMenu} className={classes.addButton}>
            <AddBoxIcon className={classes.addIcon}/>
        </IconButton>
        <Menu anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={closeSunMenu}>
            <MenuItem onClick={() => {
                onClick({})
                closeSunMenu();
            }}>Элемент</MenuItem>
            <MenuItem onClick={() => {
                fastElement();
                closeSunMenu();
            }}>Быстрый список</MenuItem>
            <MenuItem onClick={() => {
                fastFolder()
                closeSunMenu();
            }}>Быстрая папка</MenuItem>
        </Menu>
    </Box>;
}

Element.propTypes = {
    currentTheme: PropTypes.string,
    onClick: PropTypes.func,
    fastFolder: PropTypes.func,
    fastList: PropTypes.func,
}
const mapStateToProps = state => ({
    currentTheme: state.theme,
})
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddElement)