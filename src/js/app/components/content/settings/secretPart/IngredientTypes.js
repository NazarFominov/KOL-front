import React, {useEffect, useRef, useState} from 'react'
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import {setSecretKey as dispatchSetSecretKey} from "../../../../../redux/actions";
import IconButton from "@material-ui/core/IconButton";
import {Add as AddBoxIcon, Delete as DeleteIcon} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    recipeIngredientBlock: {
        display: 'flex',

        "& >*": {
            marginRight: 20,
        }
    },
    iconButton: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,

        "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.secondary.contrastText,
        }
    }
}));

function IngredientTypes(props) {
    const classes = useStyles()

    const recipeIngredientType = useRef(null)
    const recipeIngredientName = useRef(null)

    const [recipeIngredients, setRecipeIngredients] = useState(null)

    useEffect(() => {
        getIngredientTypes();
    }, [])

    function getIngredientTypes() {
        axios.get('types/ingredient')
            .then(({data}) => setRecipeIngredients([...data]))
    }

    function addIngredientType() {
        console.log(recipeIngredientName)
        const data = {
            name: recipeIngredientName?.current?.value || null,
            type: recipeIngredientType?.current?.value || null
        }
        axios.post('types/ingredient', data)
            .then(() => {
                recipeIngredientType.current.value = null;
                recipeIngredientName.current.value = null;
                getIngredientTypes();
            })
    }

    return <div className="settings-secret-part">
        <div>
            <h3>Добавить новый ингридиент рецепта</h3>
            <div className={classes.recipeIngredientBlock}>
                <TextField label="Название" color="primary"
                           inputRef={recipeIngredientName}
                           variant="standard"/>
                <TextField label="Тип" color="primary"
                           inputRef={recipeIngredientType}
                           variant="standard"/>
                <IconButton className={classes.iconButton} onClick={addIngredientType}>
                    <AddBoxIcon/>
                </IconButton>
            </div>
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            <div className="display-table width-100">
                {recipeIngredients && recipeIngredients.reverse().map(t => <div>
                    <div className="margin-right-10">{t.name}</div>
                    <div className="margin-right-10">{t.type}</div>
                </div>)}
            </div>
        </div>
    </div>
}


IngredientTypes.propTypes = {}
const mapStateToProps = state => ({})
const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(IngredientTypes)