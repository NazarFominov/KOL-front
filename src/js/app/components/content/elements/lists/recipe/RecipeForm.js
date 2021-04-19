import React, {useEffect, useRef, useState} from 'react'
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Accordion from "@material-ui/core/Accordion";
import {Add as AddBoxIcon, Add as AddIcon, ExpandMore as ExpandMoreIcon} from '@material-ui/icons'
import AccordionDetails from "@material-ui/core/AccordionDetails";
import axios from 'axios'
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {newObject} from "../../../../../controls/SimpleFunctions";
import {makeStyles} from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";
import ReactSelect from "react-select";
import {
    MoodBad,
    SentimentVeryDissatisfied,
    SentimentSatisfied,
    SentimentSatisfiedAlt,
    InsertEmoticon
} from "@material-ui/icons"
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import {Link} from "react-router-dom";
import {themes} from "../../../../../controls/constants/themes";
import Menu from "@material-ui/core/Menu";
import clsx from "clsx";
import Button from '@material-ui/core/Button';
import isMobile from "../../../../../../redux/reducers/isMobile";
import PropTypes from "prop-types";
import {setTheme} from "../../../../../../redux/actions";
import {connect} from "react-redux";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: 'calc(50% - 10px)',
        marginLeft: 0
    },
    difficultyLevel1: {
        backgroundColor: theme.palette.primary.light
    },
    difficultyLevel2: {
        backgroundColor: theme.palette.primary.main
    },
    difficultyLevel3: {
        backgroundColor: theme.palette.primary.dark
    },
    favoriteLevelIcon: {
        color: theme.palette.secondary.main + '44',

        "&:hover": {
            color: theme.palette.secondary.dark,
        }
    },
    favoriteLevelIconActive: {
        color: theme.palette.secondary.main,
    },
    ingredient: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
    recipeLink: {
        width: "100%",

        "& input": {
            color: '#551A8B',
        }
    },
}));

const MenuProps = {
    PaperProps: {
        style: {
            width: 300,
            maxHeight: 'calc(100% - 170px)'
        },
    },
};
const IngredientProps = {
    PaperProps: {
        style: {
            width: 300,
            maxHeight: 'calc(100% - 170px)',
        },
    },
};

export function RecipeForm(props) {
    const classes = useStyles()

    const {isMobile, onSave, types, ingredients, categories} = props

    const ingredientInput = useRef(null)
    const ingredientsVariants = useRef(null)

    const [recipe, setRecipe] = useState({
        name: null,
        difficulty: 2,
        favoriteLevel: 3,
        link: null,
        note: null
    })
    const [recipeCategories, setRecipeCategories] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeTypes, setRecipeTypes] = useState([]);

    const [ingredientsListAnchor, setIngredientsListAnchor] = useState(null)
    const [ingredientsFilter, setIngredientFilter] = useState(null)

    useEffect(() => {
        const disableVariants = (e) => {
            if (!e?.target?.classList.contains('ingredient-variant')) ingredientsVariants.current.style.display = "none"
        }

        window.addEventListener('click', disableVariants)

        return () => window.removeEventListener('click', disableVariants)
    }, [])

    function setDifficultyLevel(value) {
        // const levels = Array.from(document.getElementsByClassName("levels")[0].children);
        // for (let i = 0; i < value; i++) {
        //     levels[i].classList.add("active")
        // }
        // for (let i = value; i < 3; i++) {
        //     levels[i].classList.remove("active")
        // }

        recipe.difficulty = value;
        setRecipe(newObject(recipe));
    }

    function setFavoriteLevel(level) {
        recipe.favoriteLevel = level;
        setRecipe(newObject(recipe))
    }

    function getIngredientNameById(id) {
        return ingredients?.find(i => i.id === id)?.name || "Не найдено имя"
    }

    function setRecipeField(field, value) {
        recipe[field] = value || null
        setRecipe(newObject(recipe))
    }

    return <AccordionDetails className={"recipe-fields"}>
        <TextField label={"Название"} className={'recipe-name'} variant={"standard"}
                   onChange={e => setRecipeField("name", e.target.value)}/>
        {types && categories && <div className="recipe-type">
            <FormControl className={classes.formControl}>
                <InputLabel>Тип</InputLabel>
                <Select multiple
                        value={recipeTypes}
                        onChange={(event) => {
                            setRecipeTypes(event.target.value || [])
                        }}
                        input={<Input/>}
                        renderValue={selected => selected ? selected.map(typeId => {
                            return types.find(t => t.id === typeId).name
                        }).join(", ") : ''}
                        MenuProps={MenuProps}>
                    {types && types
                        .sort((a, b) => a.name > b.name ? 1 : -1)
                        .map(t => <MenuItem key={t.id} value={t.id}>
                            <Checkbox checked={recipeTypes.includes(t.id)}/>
                            <ListItemText primary={t.name}/>
                        </MenuItem>)}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Категория</InputLabel>
                <Select value={recipeCategories}
                        multiple
                        onChange={(event) => {
                            setRecipeCategories(event.target.value || [])
                        }}
                        input={<Input/>}
                        renderValue={selected => selected ? selected.map(categoryId => {
                            return categories.find(c => c.id === categoryId).name
                        }).join(", ") : ''}
                        MenuProps={MenuProps}>
                    {categories && categories
                        .sort((a, b) => a.name > b.name ? 1 : -1)
                        .map(t => <MenuItem key={t.id} value={t.id}>
                            <Checkbox checked={recipeCategories.includes(t.id)}/>
                            <ListItemText primary={t.name}/>
                        </MenuItem>)}
                </Select>
            </FormControl>
        </div>}
        <div className="recipe-details">
            <div className="difficulty">
                <div className="title">Сложность</div>
                <div className="levels">
                    <div onClick={() => setDifficultyLevel(1)}
                         className={clsx(classes.difficultyLevel1, recipe.difficulty >= 1 ? "active" : "")}/>
                    <div onClick={() => setDifficultyLevel(2)}
                         className={clsx(classes.difficultyLevel2, recipe.difficulty >= 2 ? "active" : "")}/>
                    <div onClick={() => setDifficultyLevel(3)}
                         className={clsx(classes.difficultyLevel3, recipe.difficulty === 3 ? "active" : "")}/>
                </div>
            </div>
            <div className="favorite-level">
                <div className="title">Любимость</div>
                <div className="levels">
                    <MoodBad
                        className={recipe.favoriteLevel === 1 ? classes.favoriteLevelIconActive : classes.favoriteLevelIcon}
                        onClick={() => setFavoriteLevel(1)}/>
                    <SentimentVeryDissatisfied
                        className={recipe.favoriteLevel === 2 ? classes.favoriteLevelIconActive : classes.favoriteLevelIcon}
                        onClick={() => setFavoriteLevel(2)}/>
                    <SentimentSatisfied
                        className={recipe.favoriteLevel === 3 ? classes.favoriteLevelIconActive : classes.favoriteLevelIcon}
                        onClick={() => setFavoriteLevel(3)}/>
                    <SentimentSatisfiedAlt
                        className={recipe.favoriteLevel === 4 ? classes.favoriteLevelIconActive : classes.favoriteLevelIcon}
                        onClick={() => setFavoriteLevel(4)}/>
                    <InsertEmoticon
                        className={recipe.favoriteLevel === 5 ? classes.favoriteLevelIconActive : classes.favoriteLevelIcon}
                        onClick={() => setFavoriteLevel(5)}/>
                </div>
            </div>
        </div>
        {ingredients && <div className="ingredients-block">
            <div className="title">Ингредиенты</div>
            <div className="input-block">
                <TextField variant="standard" placeholder={"Например, краб..."} inputRef={ingredientInput}
                           onClick={e => {
                               e.stopPropagation();
                               e.preventDefault();
                           }}
                           onFocus={() => {
                               ingredientsVariants.current.style.display = "block"
                           }}
                           onChange={(e) => {
                               setIngredientFilter(e.target.value)
                           }}/>
                <div className="ingredients-variants" ref={ingredientsVariants}>
                    {ingredients.filter(i => ingredientsFilter ? i.name.toLowerCase().includes(ingredientsFilter.toLowerCase()) : true)
                        .map(i => <div key={i.id} className="ingredient-variant"
                                       onClick={() => {
                                           ingredientInput.current.value = null
                                           setIngredientFilter(null)
                                           ingredientsVariants.current.style.display = "none"
                                           setRecipeIngredients([...new Set([...recipeIngredients, i.id])])
                                       }}>
                            {i.name}
                        </div>)}
                </div>
            </div>
            <div className="ingredients">
                {recipeIngredients.map(ingredientId => {
                    return <div className={clsx(classes.ingredient, "no-select")}
                                onClick={() => {
                                    setRecipeIngredients(recipeIngredients.filter(i => i !== ingredientId))
                                }}>
                        {getIngredientNameById(ingredientId)}
                    </div>
                })}
            </div>
            {recipeIngredients && Boolean(recipeIngredients.length) &&
            <div style={{opacity: 0.7}}>(кликните на игредиент для удаления)</div>}
        </div>}
        <div className="recipe-link">
            <TextField variant={"standard"} label={"Ссылка"} className={classes.recipeLink}
                       onChange={e => setRecipeField("link", e.target.value)}/>
        </div>
        <div className="recipe-note">
            <TextField multiline variant={"outlined"} label={"Заметка"} className="width-100"
                       onChange={e => setRecipeField("note", e.target.value)}/>
        </div>
        <div className={"recipe-add-button"}>
            <Button variant="contained" color="primary"
                    className={clsx(isMobile ? "width-100" : "")}
                    onClick={() => onSave({
                        ...recipe,
                        types: recipeTypes,
                        categories: recipeCategories,
                        ingredients: recipeIngredients
                    })}>
                Сохранить
            </Button>
        </div>
    </AccordionDetails>
}

RecipeForm.defaultProps = {
    onSave: console.log
}
RecipeForm.propTypes = {
    isMobile: PropTypes.bool,
    onSave: PropTypes.func
}
const mapStateToProps = state => ({
    isMobile: state.isMobile
})
const mapDispatchToProps = (dispatch) => ({});

function RecipeFormBlock(props) {
    return <div className="recipe-form">
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                              aria-controls="panel1a-content">
                <Typography>Сохранить рецепт</Typography>
            </AccordionSummary>
            <RecipeForm {...props}/>
        </Accordion>
    </div>
}


export default connect(mapStateToProps, mapDispatchToProps)(RecipeFormBlock)

