import React, {useEffect, useState} from 'react'
import Preloader from "../../../../../../controls/Preloader";
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import axios from 'axios';
import {convertObjectToQueryString} from "../../../../../../controls/Convert";
import {Menu} from "./Menu";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    recipe: {
        '&>*': {
            background: '#eeeeee'
        }
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function MenuWrapper(props) {
    const classes = useStyles();

    const [preloader, setPreloader] = useState(true);
    const [menu, setMenu] = useState(null);

    const {list, close} = props;

    useEffect(() => {
        getMenu();
    }, [])

    useEffect(() => {
        if (menu) setPreloader(false)
    }, [menu])

    function getMenu() {
        const q = convertObjectToQueryString({
            id: list.id
        })

        axios.get('list/menu' + q)
            .then(({data}) => setMenu(data))
            .catch(console.log)
    }

    return <Dialog fullScreen open={true} onClose={close} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={close} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {list.name}
                </Typography>
            </Toolbar>
        </AppBar>
        {!preloader ? <DialogContent>
                <Menu menu={menu?.menu || []}
                      classNameRecipe={classes.recipe}
                      renderControls={false}/>
            </DialogContent>
            : <Preloader/>}
    </Dialog>
}

MenuWrapper.propTypes = {
    list: PropTypes.object,
    close: PropTypes.func
}

export default MenuWrapper;