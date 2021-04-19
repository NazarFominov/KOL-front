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
    recipeTypeBlock: {
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

function RecipeTypes(props) {
    const classes = useStyles()

    const recipeType = useRef(null)
    const recipeName = useRef(null)

    const [recipeTypes, setRecipeTypes] = useState(null)

    useEffect(() => {
        getRecipeTypes();
    }, [])

    function getRecipeTypes() {
        axios.get('recipe/types')
            .then(({data}) => setRecipeTypes([...data]))
    }

    function addRecipeType() {
        console.log(recipeName)
        const data = {
            name: recipeName?.current?.value || null,
            type: recipeType?.current?.value || null
        }
        axios.post('recipe/type', data)
            .then(() => {
                recipeType.current.value = null;
                recipeName.current.value = null;
                getRecipeTypes();
            })
    }

    return <div className="settings-secret-part">
        <div>
            <h3>Добавить новый тип рецепта</h3>
            <div className={classes.recipeTypeBlock}>
                <TextField label="Название" color="primary"
                           inputRef={recipeName}
                           variant="standard"/>
                <TextField label="Тип" color="primary"
                           inputRef={recipeType}
                           variant="standard"/>
                <IconButton className={classes.iconButton} onClick={addRecipeType}>
                    <AddBoxIcon/>
                </IconButton>
            </div>
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            <div className="display-table width-100">
                {recipeTypes && recipeTypes.reverse().map(t => <div>
                    <div className="margin-right-10">{t.name}</div>
                    <div className="margin-right-10">{t.type}</div>
                </div>)}
            </div>
        </div>
    </div>
}


RecipeTypes.propTypes = {}
const mapStateToProps = state => ({})
const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(RecipeTypes)