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
    recipeCategoryBlock: {
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

function RecipeCategory(props) {
    const classes = useStyles()

    const recipeCategoryType = useRef(null)
    const recipeCategoryName = useRef(null)

    const [recipeCategories, setRecipeCategories] = useState(null)

    useEffect(() => {
        getRecipeCategories();
    }, [])

    function getRecipeCategories() {
        axios.get('types/category')
            .then(({data}) => setRecipeCategories([...data]))
    }

    function addRecipeCategory() {
        console.log(recipeCategoryName)
        const data = {
            name: recipeCategoryName?.current?.value || null,
            type: recipeCategoryType?.current?.value || null
        }
        axios.post('types/category', data)
            .then(() => {
                recipeCategoryType.current.value = null;
                recipeCategoryName.current.value = null;
                getRecipeCategories();
            })
    }

    return <div className="settings-secret-part">
        <div>
            <h3>Добавить новую категорию рецепта</h3>
            <div className={classes.recipeCategoryBlock}>
                <TextField label="Название" color="primary"
                           inputRef={recipeCategoryName}
                           variant="standard"/>
                <TextField label="Тип" color="primary"
                           inputRef={recipeCategoryType}
                           variant="standard"/>
                <IconButton className={classes.iconButton} onClick={addRecipeCategory}>
                    <AddBoxIcon/>
                </IconButton>
            </div>
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            <div className="display-table width-100">
                {recipeCategories && recipeCategories.reverse().map(t => <div>
                    <div className="margin-right-10">{t.name}</div>
                    <div className="margin-right-10">{t.type}</div>
                </div>)}
            </div>
        </div>
    </div>
}


RecipeCategory.propTypes = {}
const mapStateToProps = state => ({})
const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(RecipeCategory)