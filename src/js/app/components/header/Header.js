import React, {useEffect} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    AccountCircle,
    Notifications as NotificationsIcon,
    MoreVert as MoreIcon
} from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {themes} from "../../controls/constants/themes";
import PropTypes from "prop-types";
import {setBreadcrumbs, setNameString, setTheme} from "../../../redux/actions";
import {connect} from "react-redux";
import BurgerMenu from "./BurgerMenu";
import Redirect from "react-router-dom/Redirect";
import {Link, useLocation} from "react-router-dom";
import breadcrumbs from "../../../redux/reducers/breadcrumbs";
import nameString from "../../../redux/reducers/nameString";
import * as axios from "axios";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    themes: {
        display: "flex",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    theme: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        margin: '5px'
    },
    link: {
        textDecoration: 'unset',
        color: 'inherit',
        display: 'block',
        height: '100%',
        width: '100%'
    }
}));

function HideOnScroll(props) {
    const {children, window} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({target: window ? window() : undefined});

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

function Header(props) {
    const classes = useStyles();
    let location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [menuIsOpen, setMenuIsOpen] = React.useState(false)
    const [redirect, setRedirect] = React.useState(false)

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const {setBreadcrumbs, setTheme, currentTheme, setNameString, nameString, cancelToken} = props;

    useEffect(() => {
        setRedirect(null)
    }, [redirect])

    useEffect(() => {
        if (location.pathname !== '/search') {
            setNameString(null)
            document.getElementById("search-name-string").value = null
        }
    }, [location])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu anchorEl={anchorEl}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              id={menuId}
              keepMounted
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={isMenuOpen}
              onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
                <Link className={classes.link}
                      onClick={() => props.setBreadcrumbs([{id: null}, {id: 'settings', name: "Настройки"}])}
                      to={'/settings?tab=0'}>Секретный код</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Link className={classes.link}
                      onClick={() => props.setBreadcrumbs([{id: null}, {id: 'settings', name: "Настройки"}])}
                      to={'/settings?tab=1'}>Профиль</Link>
            </MenuItem>
            <MenuItem className={classes.themes}>
                {themes.map(t => <div key={t.name}
                                      className={classes.theme}
                                      onClick={() => props.setTheme(t.name)}
                                      style={{backgroundColor: t.theme.palette.primary.main}}/>)}
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              id={mobileMenuId}
              keepMounted
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={isMobileMenuOpen}
              onClose={handleMobileMenuClose}>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Уведомления</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit">
                    <AccountCircle/>
                </IconButton>
                <p>Профиль</p>
            </MenuItem>
            <MenuItem className={classes.themes}>
                {themes.map(t => <div key={t.name}
                                      className={classes.theme}
                                      onClick={() => props.setTheme(t.name)}
                                      style={{backgroundColor: t.theme.palette.primary.main}}/>)}
            </MenuItem>
        </Menu>
    );

    return (
        <React.Fragment>
            <HideOnScroll {...props}>
                <div className={classes.grow}>
                    <AppBar position="relative">
                        <Toolbar>
                            <IconButton edge="start"
                                        onClick={() => setMenuIsOpen(!menuIsOpen)}
                                        className={classes.menuButton}
                                        color="inherit"
                                        aria-label="open drawer">
                                <MenuIcon/>
                            </IconButton>
                            <Typography className={classes.title} variant="h6" noWrap>
                                Kingdom Of Lists
                            </Typography>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <InputBase value={nameString}
                                           placeholder="Поиск элемента…"
                                           onChange={e => {
                                               if (cancelToken?.search?.token?.cancel) cancelToken?.search?.token?.cancel()
                                               setNameString(e.target.value || null)
                                               if (!location.pathname.includes('search')) {
                                                   setBreadcrumbs([{id: null}, {id: "search", name: "Поиск"}])
                                                   setRedirect("/search")
                                               }
                                           }}
                                           classes={{
                                               root: classes.inputRoot,
                                               input: classes.inputInput,
                                           }}
                                           id={"search-name-string"}
                                           inputProps={{'aria-label': 'search'}}/>
                            </div>
                            <div className={classes.grow}/>
                            <div className={classes.sectionDesktop}>
                                <IconButton aria-label="show 17 new notifications" color="inherit">
                                    <Badge badgeContent={17} color="secondary">
                                        <NotificationsIcon/>
                                    </Badge>
                                </IconButton>
                                <IconButton edge="end"
                                            aria-label="account of current user"
                                            aria-controls={menuId}
                                            aria-haspopup="true"
                                            onClick={handleProfileMenuOpen}
                                            color="inherit">
                                    <AccountCircle/>
                                </IconButton>
                            </div>
                            <div className={classes.sectionMobile}>
                                <IconButton aria-label="show more"
                                            aria-controls={mobileMenuId}
                                            aria-haspopup="true"
                                            onClick={handleMobileMenuOpen}
                                            color="inherit">
                                    <MoreIcon/>
                                </IconButton>
                            </div>
                        </Toolbar>
                    </AppBar>
                    {renderMobileMenu}
                    {renderMenu}
                    <BurgerMenu isOpen={menuIsOpen}
                                onChangeState={setMenuIsOpen}/>
                </div>
            </HideOnScroll>
            {redirect && <Redirect to={redirect}/>}
        </React.Fragment>
    );
}

Header.propTypes = {
    setTheme: PropTypes.func,
    setBreadcrumbs: PropTypes.func,
    setNameString: PropTypes.func,
    currentTheme: PropTypes.string,
    nameString: PropTypes.string,
    cancelToken: PropTypes.object,
}
const mapStateToProps = state => ({
    currentTheme: state.theme,
    nameString: state.nameString,
    cancelToken: state.cancelTokenSource,
})
const mapDispatchToProps = (dispatch) => ({
    setTheme: theme => dispatch(setTheme(theme)),
    setBreadcrumbs: breadcrumbs => dispatch(setBreadcrumbs(breadcrumbs)),
    setNameString: nameString => dispatch(setNameString(nameString)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Header)