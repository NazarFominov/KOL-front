import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {Lines} from 'react-preloaders';
import theme from "../../../redux/reducers/theme";
import Preloader from "../Preloader";
import {TextFieldsOutlined} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {convertObjectToQueryString} from "../Convert";

const useStyles = makeStyles((theme) => ({
    dialog: {
        '& MuiDialog-paperScrollPaper': {
            minHeight: 300,
        }
    },
    input: {
        marginBottom: 10
    },
    table: {
        display: "table",
        width: '100%',

        '& >*': {
            display: 'table-row',

            '& >*': {
                display: 'table-cell',
                width: '50%',
                padding: '5px 10px',
                cursor: 'pointer'
            }
        },
        '& >*:nth-child(2n-1)': {
            '& >*': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
            }
        },
        '& >*:hover': {
            '& >*': {
                backgroundColor: theme.palette.primary.dark + "!important",
                color: theme.palette.primary.contrastText
            }
        }
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FoldersModal(props) {
    const classes = useStyles();

    const [folders, setFolders] = useState(null)
    const [filterName, setFilterName] = useState(null)

    const {onClose, onSelectFolder, excludeIds, excludeChildrenOfIds} = props;
    useEffect(() => {
        getFolders();
    }, [])

    function getFolders() {
        const q = convertObjectToQueryString({
            excludeChildrenOfIds: excludeChildrenOfIds ? excludeChildrenOfIds : null
        })

        axios.get('elements/folders' + q)
            .then(({data}) => setFolders([{
                id: null,
                name: "Корневая папка"
            }, ...data]))
    }

    function changeFilterName(e) {
        setFilterName(e.target.value || null)
    }

    return <Dialog open={true}
                   fullWidth={true}
                   TransitionComponent={Transition}
                   keepMounted
                   onClose={onClose}
                   aria-labelledby="alert-dialog-slide-title"
                   aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title">Список папок</DialogTitle>
        <DialogContent>
            {folders &&<TextField label="Название папки" color="primary"
                       onChange={changeFilterName}
                       className={classes.input} variant="standard"/>}
            <DialogContentText id="alert-dialog-slide-description">
                {folders ? <div className={classes.table}>
                        {folders
                            .filter(f => !excludeIds.includes(f.id))
                            .filter(f => filterName ? f.name.toLowerCase().includes(filterName.toLowerCase()) : true)
                            .map(f => <div key={f.id} onClick={() => onSelectFolder(f)}>
                                <div>{f.name}</div>
                                <div>{f.description}</div>
                            </div>)}
                    </div>
                    : <Preloader/>
                }
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Отмена</Button>
        </DialogActions>
    </Dialog>
}

FoldersModal.defaultProps = {
    onSelectFolder: console.log,
    excludeIds: [],
    excludeChildrenOfIds: []
}
FoldersModal.propTypes = {
    onSelectFolder: PropTypes.func,
    onClose: PropTypes.func,
    excludeIds: PropTypes.array,
    excludeChildrenOfIds: PropTypes.array,
}
const mapStateToProps = (state) => ({})
const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(FoldersModal)