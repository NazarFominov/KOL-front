import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
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
import {convertObjectToQueryString} from "../../../../../../controls/Convert";
import Preloader from "../../../../../../controls/Preloader";
import RecipeForm, {RecipeForm as RecipeFormForElement} from "./RecipeForm";
import RecipeElement from "./RecipeElement";
import {connect} from "react-redux";
import {setDialogModal} from "../../../../../../../redux/actions";
import Filter from "./Filter";
import {newObject} from "../../../../../../controls/SimpleFunctions";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Recipes(props) {
    const classes = useStyles();
    const {list, close, setDialogModal} = props;

    const [recipes, setRecipes] = useState(null)

    const [preloader, setPreloader] = useState(true)
    const [editableId, setEditableId] = useState(null)
    const [filter, setFilter] = useState({
        name: null,
        types: [],
        categories: [],
        ingredients: [],
        loveLevel: [],
        difficulty: null,
    })

    const [types, setTypes] = useState(null)
    const [categories, setCategories] = useState(null)
    const [ingredients, setIngredients] = useState(null)

    useEffect(() => {
        getRecipeList();
        getRecipeTypes();
        getRecipeIngredients();
        getRecipeCategories();
    }, [])

    function getRecipeTypes() {
        axios.get('recipe/types')
            .then(({data}) => setTypes(data))
    }

    function getRecipeCategories() {
        axios.get('recipe/categories')
            .then(({data}) => setCategories(data))
    }

    function getRecipeIngredients() {
        axios.get('recipe/ingredients')
            .then(({data}) => setIngredients(data))
    }

    function getRecipeList() {
        const q = convertObjectToQueryString({
            id: list.id
        })

        axios.get(`list/recipes` + q)
            .then(({data}) => {
                setPreloader(false);
                setRecipes([...data].reverse());
            })
    }

    function sendRecipe(method, recipe) {
        axios({
            method: method,
            url: method === 'post' ? `list/${list.id}/recipe` : `list/${list.id}/recipe/${recipe.id}`,
            data: recipe
        }).then(getRecipeList)
    }

    function deleteRecipe(recipeId) {
        axios.delete(`list/${list.id}/recipe/${recipeId}`).then(getRecipeList)
    }

    function setFilterFiledValue(field, value) {
        filter[field] = value;
        setFilter(newObject(filter))
    }

    function sortByFieldArray(recipe, field) {
        return filter[field] && Array.isArray(filter[field]) && filter[field].length
            ? recipe[field].some(f => filter[field].includes(f.id))
            : true
    }

    return <Dialog fullScreen open={open} onClose={close} TransitionComponent={Transition}>
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
        <DialogContent className="recipe-list">
            {types && ingredients && categories && <RecipeForm onSave={(recipe) => sendRecipe("post", recipe)}
                                                               types={types}
                                                               categories={categories}
                                                               ingredients={ingredients}/>}
            <Filter setFilter={setFilterFiledValue}
                    filter={filter}
                    types={types}
                    categories={categories}
                    ingredients={ingredients}/>
            {recipes && recipes
                .filter(r => filter.name ? r.name.toLowerCase().includes(filter.name.toLowerCase()) : true)
                .filter(r => sortByFieldArray(r, 'types'))
                .filter(r => sortByFieldArray(r, 'categories'))
                .filter(r => sortByFieldArray(r, 'ingredients'))
                .filter(r => filter.loveLevel.length ? filter.loveLevel.includes(r.loveLevel) : true)
                .filter(r => filter.difficulty ? r.difficulty === filter.difficulty : true)
                .map(r => editableId === r.id ?
                    <RecipeForm recipe={r}
                                key={r.id}
                                expandedMode={true}
                                types={types}
                                title={"Редактирование рецепта"}
                                categories={categories}
                                ingredients={ingredients}
                                onSave={(recipe) => {
                                    setEditableId(null)
                                    sendRecipe("put", {...recipe, id: r.id})
                                }}
                                onCancel={() => setEditableId(null)}/> :
                    <RecipeElement key={r.id}
                                   recipe={r}
                                   onSetEdit={() => setEditableId(r.id)}
                                   onDelete={() => setDialogModal({
                                       open: true,
                                       agree: () => deleteRecipe(r.id),
                                       title: "Внимание",
                                       message: `Вы хотите удалить "${r.name}"?`
                                   })}/>)}
            {preloader && <Preloader/>}
        </DialogContent>
    </Dialog>
}

Recipes.propTypes = {
    list: PropTypes.object,
    close: PropTypes.func,
    setDialogModal: PropTypes.func
}

const mapStateToProps = state => ({})
const mapDispatchToProps = (dispatch) => ({
    setDialogModal: v => dispatch(setDialogModal(v)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recipes)
