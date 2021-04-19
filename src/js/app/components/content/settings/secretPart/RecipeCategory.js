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
        "& >*": {
            marginBottom: 10,
            "& >*": {
                marginRight: 20,
            }
        }
    },
    iconButton: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
        textAlign: "center",
        width: '100%',

        "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.secondary.contrastText,
        }
    }
}));

function RecipeCategory(props) {
    const classes = useStyles()

    const [newTypes, setNewTypes] = useState([{}]);

    const [recipeCategories, setRecipeCategories] = useState(null)

    useEffect(() => {
        getRecipeCategories();
    }, [])

    useEffect(() => {
        if (!newTypes) setNewTypes([{}])
    }, [newTypes])

    function getRecipeCategories() {
        axios.get('recipe/categories')
            .then(({data}) => setRecipeCategories([...data]))
    }

    function addRecipeCategory() {
        newTypes.filter(t => t.name && t.type).forEach(async t => {
            await axios.post('recipe/category', t)
        })

        setNewTypes(null)

        getRecipeCategories()
    }

    return <div className="settings-secret-part">
        <div>
            <h3>Добавить новую категорию рецепта</h3>
            <div className={classes.recipeCategoryBlock}>
                {newTypes && newTypes.map((t, i) => <div>
                    <TextField label="Название" color="primary"
                               onChange={(e) => {
                                   if (newTypes.length - 1 === i) newTypes.push({})
                                   newTypes[i].name = e.target.value;
                                   setNewTypes([...newTypes])
                               }}
                               className={classes.input} variant="standard"/>
                    <TextField label="Тип" color="primary"
                               onChange={(e) => {
                                   if (newTypes.length - 1 === i) newTypes.push({})
                                   newTypes[i].type = e.target.value;
                                   setNewTypes([...newTypes])
                               }}
                               className={classes.input} variant="standard"/>
                </div>)}
                <Button className={classes.iconButton} onClick={addRecipeCategory}>
                    Добавить
                </Button>
            </div>
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            <div className="display-table width-100">
                {recipeCategories && recipeCategories.sort((a, b) => a.name > b.name ? 1 : -1).map((t, i) => <div>
                    <div className="margin-right-10">{i + 1}</div>
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