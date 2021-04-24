import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types'
import DialogContent from "@material-ui/core/DialogContent";
import axios from 'axios'
import {convertObjectToQueryString} from "../../../../../controls/Convert";
import Preloader from "../../../../../controls/Preloader";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    textarea: {
        width: '100%',
        height: 'calc(99% - 20px);',
        boxSizing: 'border-box',
        border: 'none',
        outline: 'none',
        fontSize: 18,
        marginTop: 20
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Notes(props) {
    const classes = useStyles();
    const {list, close} = props;

    const [preloader, setPreloader] = useState(true)
    const [text, setText] = useState(true)


    useEffect(() => {
        getNote()
    }, [])

    function getNote() {
        const q = convertObjectToQueryString({
            id: list.id
        })

        axios.get('list/note' + q)
            .then(({data}) => {
                setText(data.text)
                setPreloader(false)
            })
    }

    function setNote() {
        const data = {
            id: list.id,
            text: text
        }
        axios.put('list/note', data)
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
                <Button color="inherit" onClick={setNote}>
                    Сохранить
                </Button>
            </Toolbar>
        </AppBar>
        {!preloader ? <DialogContent>
                <textarea className={classes.textarea} autoFocus={true} defaultValue={text}
                          onChange={({target}) => setText(target.value || null)}/>
            </DialogContent>
            : <Preloader/>}
    </Dialog>
}

Notes.propTypes = {
    list: PropTypes.object,
    close: PropTypes.func
}

export default Notes;