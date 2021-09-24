import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {
    Folder as FolderIcon,
    FormatListBulleted as FormatListBulletedIcon, FormatListNumbered as FormatListNumberedIcon,
    ListAlt as ListAltIcon, ShoppingCart as ShoppingCartIcon, Theaters as TheatersIcon
} from '@material-ui/icons'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setFavoritesList} from "../../../redux/actions";

const useStyles = makeStyles({
    list: {
        width: 320,
    },
    fullList: {
        width: 'auto',
    },
    link: {
        color: 'inherit',
        textDecoration: 'unset'
    }
});

function BurgerMenu({isOpen, onChangeState = console.log, favorites}) {
    const classes = useStyles();
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    useEffect(() => {
        setState({...state, ['left']: isOpen});
    }, [isOpen])

    useEffect(() => {
        onChangeState(state.left)
    }, [state])

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };

    const list = (anchor) => (
        <div role="presentation"
             className={clsx(classes.list, {
                 [classes.fullList]: anchor === 'top' || anchor === 'bottom',
             })}
             onClick={toggleDrawer(anchor, false)}
             onKeyDown={toggleDrawer(anchor, false)}>
            <List>
                {[
                    {label: 'Списки', to: '/', onClick: () => null, icon: <ListAltIcon/>},
                    {label: 'Генератор меню', to: '/generator/menu', onClick: () => null},
                ].map(({label, onClick, to, icon}) => (
                    <Link to={to} className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label}/>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider/>
            <List>
                {favorites && favorites.map(favorite => {
                    const className = clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')

                    return <ListItem button key={favorite.id}>
                        <ListItemIcon>{favorite.type.type === "folder"
                            ? <FolderIcon className={className}/>
                            : (() => {
                                    switch (favorite.listType.type) {
                                        case 'notes':
                                            return <ListAltIcon className={className}/>
                                        case 'affairs':
                                            return <FormatListBulletedIcon className={className}/>
                                        case 'purchases':
                                            return <ShoppingCartIcon className={className}/>
                                        case 'films':
                                            return <TheatersIcon className={className}/>
                                        case 'recipes':
                                            return <FormatListNumberedIcon className={className}/>
                                    }
                                }
                            )()}</ListItemIcon>
                        <ListItemText primary={favorite.name}/>
                    </ListItem>
                })}
            </List>
        </div>
    );

    return (
        <div>
            {['left', 'right', 'top', 'bottom'].map((anchor) => (
                <React.Fragment key={anchor}>
                    {/*<Button olnClick={toggleDrawer(anchor, true)}>{anchor}</Button>*/}
                    <SwipeableDrawer anchor={anchor}
                                     open={state[anchor]}
                                     onClose={() => setState({...state, [anchor]: false})}
                                     onOpen={() => setState({...state, [anchor]: true})}>
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}

BurgerMenu.propTypes = {
    favorites: PropTypes.array,
}
const mapStateToProps = (state) => ({
    favorites: state.favoritesList,
})
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BurgerMenu)