import React, {useState} from 'react';
import clsx from 'clsx';
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles';
import Collapse from "@material-ui/core/Collapse";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ExpandMore as ExpandMoreIcon,
    MoreVert as MoreVertIcon,
    Folder as FolderIcon,
    Theaters as TheatersIcon,
    FormatListBulleted as FormatListBulletedIcon,
    ShoppingCart as ShoppingCartIcon,
    FormatListNumbered as FormatListNumberedIcon,
    RestaurantMenu as RestaurantMenuIcon,
    MenuBook as MenuBookIcon,
    ListAlt as ListAltIcon
} from "@material-ui/icons";
import {CardContent} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import PropTypes from "prop-types";
import Redirect from "react-router-dom/Redirect";
import {setFavoritesList} from "../../../../../../redux/actions";
import favoritesList from "../../../../../../redux/reducers/favoritesList";
import {getFavorites} from "../../../../../controls/InitialRequests";

const useStyles = makeStyles((theme) => ({
    element: {
        backgroundColor: element => theme.palette[element.type.type === 'folder' ? 'secondary' : 'primary'].light,
        color: element => theme.palette[element.type.type === 'folder' ? 'secondary' : 'primary'].contrastText,

        '& path': {
            fill: element => theme.palette[element.type.type === 'folder' ? 'secondary' : 'primary'].contrastText,
        },
        '&:hover': {
            backgroundColor: element => theme.palette[element.type.type === 'folder' ? 'secondary' : 'primary'].main,
        }
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },

    icon: {
        color: element => theme.palette[element.type.type === 'folder' ? 'secondary' : 'primary'].contrastText
    },
    activeIconFavorite: {
        color: element => theme.palette[element.type.type === 'folder' ? 'primary' : 'secondary'].light,

        "& path": {fill: element => theme.palette[element.type.type === 'folder' ? 'primary' : 'secondary'].light + "!important"}
    },
    iconMore: {
        alignSelf: "flex-start",
        paddingBottom: 0,
        paddingTop: 0,
    },

    titleBlock: {
        paddingBottom: 0,
        paddingRight: 8,
        display: 'flex',
        alignItems: 'center'
    }
}));

function Element(props) {
    const {element, currentTheme, onDelete, onEdit, onRelocate, onSetFavorite, onOpenList} = props;

    const classes = useStyles(element);

    const [expanded, setExpanded] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [redirect, setRedirect] = useState(null);

    const openSubMenu = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const closeSunMenu = (event) => {
        event?.stopPropagation();
        setAnchorEl(null);
    };

    function handleExpandClick(event) {
        event.stopPropagation();
        setExpanded(!expanded)
    }

    function onOpen(event) {
        event?.stopPropagation();
        if (element.type.type === 'folder') onRedirect();
        if (element.type.type === 'list') onOpenList()
    }

    function onRedirect() {
        setRedirect(`/${element.id}`)
    }

    return <React.Fragment key={element.id}>
        <div className={clsx("element", "no-select", classes.element)}
             onClick={onOpen}>
            <CardContent className={classes.titleBlock}>
                <div className="title">
                    {element.type.type === "folder"
                        ? <FolderIcon className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                        : (() => {
                                switch (element.listType.type) {
                                    case 'notes':
                                        return <ListAltIcon
                                            className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                                    case 'affairs':
                                        return <FormatListBulletedIcon
                                            className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                                    case 'purchases':
                                        return <ShoppingCartIcon
                                            className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                                    case 'films':
                                        return <TheatersIcon
                                            className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                                    case 'recipes':
                                        return <RestaurantMenuIcon
                                            className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                                    case 'menu':
                                        return <MenuBookIcon
                                            className={clsx(classes.icon, 'vertical-align-middle', 'margin-right-5')}/>
                                }
                            }
                        )()}
                    <span>{element.name}</span>
                </div>
                <IconButton aria-label="settings" className={clsx(classes.icon, classes.iconMore)}
                            onClick={openSubMenu}>
                    <MoreVertIcon className={classes.icon}/>
                </IconButton>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites"
                            className={classes.icon}
                            onClick={(event) => {
                                event.stopPropagation();
                                onSetFavorite(!element.isFavorite)
                            }}>
                    {element.isFavorite ?
                        <FavoriteIcon className={classes.icon}/> :
                        <FavoriteBorderIcon className={classes.icon}/>}
                </IconButton>
                <IconButton className={clsx(classes.expand, {[classes.expandOpen]: expanded}, classes.icon)}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more">
                    <ExpandMoreIcon className={classes.icon}/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <span>{element.description}</span>
                </CardContent>
            </Collapse>
        </div>
        <Menu anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={closeSunMenu}>
            <MenuItem onClick={() => {
                onOpen()
                closeSunMenu()
            }}>Открыть</MenuItem>
            <MenuItem onClick={() => {
                onEdit(element)
                closeSunMenu();
            }}>Редактировать</MenuItem>
            <MenuItem onClick={() => {
                onRelocate(element)
                closeSunMenu();
            }}>Переместить</MenuItem>
            <MenuItem onClick={() => {
                onDelete(element)
                closeSunMenu();
            }}>Удалить</MenuItem>
        </Menu>
        {redirect && <Redirect to={redirect}/>}
    </React.Fragment>;
}

Element.defaultProps = {
    onDelete: (element) => console.log("delete", element),
    onEdit: (element) => console.log("edit", element)
}

Element.propTypes = {
    currentTheme: PropTypes.string,
    element: PropTypes.object,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onRelocate: PropTypes.func,
    onSetFavorite: PropTypes.func,
    onOpenList: PropTypes.func,
}
const mapStateToProps = state => ({
    currentTheme: state.theme,
})
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Element)