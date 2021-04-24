import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {newObject} from "../../../../../controls/SimpleFunctions";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import {connect} from "react-redux";

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',

        '& >*': {
            marginBottom: 10
        }
    },
    formControl: {
        marginTop: theme.spacing(2),
        width: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
}));

function ElementModal(props) {
    const classes = useStyles();

    const {close, editableElement, elementTypes, listTypes, onSave} = props;

    const [element, setElement] = useState({
        type: editableElement.type || elementTypes[0],
        listType: editableElement.listType || null,
        name: editableElement.name || null,
        description: editableElement.description || null,
        ...editableElement
    })

    function setType(event) {
        element.type = elementTypes.find(e => e.id === event.target.value);
        if (element.type.type === 'list') element.listType = listTypes[0];
        else element.listType = null;
        setElement(newObject(element))
    }

    function setListType(event) {
        element.listType = listTypes.find(e => e.id === event.target.value);
        setElement(newObject(element))
    }

    return <Dialog fullWidth={true}
                   maxWidth={'sm'}
                   open={true}
                   onClose={close}
                   aria-labelledby="max-width-dialog-title">
        <DialogTitle>Добавление элемента</DialogTitle>
        <DialogContent>
            <div className={classes.form}>
                {element.method === "post" && <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="element-type">Тип</InputLabel>
                        <Select value={element.type.id}
                                name={"element-type"}
                                onChange={setType}
                                inputProps={{
                                    name: 'element-type',
                                    id: 'element-type',
                                }}>
                            {elementTypes.map(t => <MenuItem value={t.id} key={t.id}>
                                {t.name}
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                    {element.type.type === 'list' &&
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="list-type">Тип списка</InputLabel>
                        <Select value={element.listType.id}
                                name={"list-type"}
                                onChange={setListType}
                                inputProps={{
                                    name: 'list-type',
                                    id: 'list-type',
                                }}>
                            {listTypes.map(t => <MenuItem value={t.id} key={t.id}>
                                {t.name}
                            </MenuItem>)}
                        </Select>
                    </FormControl>}
                </div>}
                <TextField defaultValue={element.name}
                           label="Название" name={"name"}
                           onFocus={e => {
                               if (e.target.value === "Без имени") e.target.value = null;
                               else e.target.setSelectionRange(0, e.target.value.length)
                           }}
                           onChange={e => {
                               element.name = e.target.value || null;
                               setElement(newObject(element))
                           }}/>
                <TextField defaultValue={element.description}
                           label="Описание" name={"description"} multiline rows={4}
                           onFocus={e => {
                               if (e.target.value === "Без описания") e.target.value = null;
                               else e.target.setSelectionRange(0, e.target.value.length)
                           }}
                           onChange={e => {
                               element.description = e.target.value || null;
                               setElement(newObject(element))
                           }}/>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={close} color="primary">
                Отмена
            </Button>
            <Button onClick={() => {
                if (element.type.type !== 'list' || (element.type.type === 'list' && element.listType !== null)) {
                    onSave(element)
                    close()
                }
            }} color="primary">
                Сохранить
            </Button>
        </DialogActions>
    </Dialog>
}

ElementModal.defaultProps = {
    onSave: console.log

}
ElementModal.propTypes = {
    elementTypes: PropTypes.array,
    listTypes: PropTypes.array,
    onSave: PropTypes.func
}

const mapStateToProps = state => ({
    elementTypes: state.elementTypes,
    listTypes: state.listTypes
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ElementModal)