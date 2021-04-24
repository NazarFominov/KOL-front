import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types'
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import {
    ExpandMore as ExpandMoreIcon,
    InsertEmoticon,
    MoodBad,
    SentimentSatisfied,
    SentimentSatisfiedAlt,
    SentimentVeryDissatisfied,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {IconButton} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        // width: 'calc(50% - 10px)',
        marginLeft: 0,
        minWidth: 195,
        marginBottom: 15
    },

    ingredientsBlock: {
        position: 'relative',
        width: '100%',
        flexGrow: 1,
    },
    ingredientsVariants: {
        display: 'none',
        borderRadius: '4px',
        position: 'absolute',
        width: '300px',
        maxHeight: '300px',
        overflowY: 'auto',
        boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
        background: '#fff',
        zIndex: '1300',
    },
    ingredientVariant: {
        width: 'auto',
        overflow: 'hidden',
        fontSize: '1rem',
        boxSizing: 'border-box',
        minHeight: '48px',
        fontWeight: '400',
        lineHeight: '1.5',
        paddingTop: '6px',
        whiteSpace: 'nowrap',
        letterSpacing: '0.00938em',
        paddingBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '15px',
        cursor: 'pointer',

        "& :hover": {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    },
    ingredients: {
        display: 'flex',

        "& >*": {
            marginRight: '5px',
            borderRadius: '15px',
            padding: '4px 10px',
            fontSize: '17px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px',
            cursor: 'pointer',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
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


function Filter(props) {
    const classes = useStyles();

    const ingredientInput = useRef();
    const ingredientsVariants = useRef();

    const {setFilter, categories, ingredients, types, filter} = props

    const [ingredientsFilter, setIngredientsFilter] = useState(null)

    useEffect(() => {
        const disableVariants = (e) => {
            if (!e?.target?.classList.contains('ingredient-variant')) ingredientsVariants.current.style.display = "none"
        }

        window.addEventListener('click', disableVariants)

        return () => window.removeEventListener('click', disableVariants)
    }, [])

    function getIngredientNameById(id) {
        return ingredients?.find(i => i.id === id)?.name || "Не найдено имя"
    }

    return categories && ingredients && types
        ? <Accordion className="margin-bottom-20">
            <AccordionSummary expandIcon={<ExpandMoreIcon/>} className={classes.sum}>
                <TextField variant={"standard"}
                           placeholder={"Название"}
                           onFocus={e => {
                               e.preventDefault();
                               e.stopPropagation()
                           }}
                           onClick={e => {
                               e.preventDefault();
                               e.stopPropagation();
                           }}
                           onChange={e => setFilter('name', e.target.value || null)}/>
            </AccordionSummary>
            <AccordionDetails className="flex-wrap-wrap">
                <FormControl className={classes.formControl}>
                    <InputLabel>Тип</InputLabel>
                    <Select multiple
                            value={filter.types}
                            onChange={(event) => {
                                setFilter('types', event.target.value || [])
                            }}
                            input={<Input/>}
                            renderValue={selected => selected ? selected.map(typeId => {
                                return types.find(t => t.id === typeId).name
                            }).join(", ") : ''}
                            MenuProps={MenuProps}>
                        {types.sort((a, b) => a.name > b.name ? 1 : -1)
                            .map(t => <MenuItem key={t.id} value={t.id}>
                                <Checkbox checked={filter.types.includes(t.id)}/>
                                <ListItemText primary={t.name}/>
                            </MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel>Категория</InputLabel>
                    <Select multiple
                            value={filter.categories}
                            onChange={(event) => {
                                setFilter('categories', event.target.value || [])
                            }}
                            input={<Input/>}
                            renderValue={selected => selected ? selected.map(categoryId => {
                                return categories.find(c => c.id === categoryId).name
                            }).join(", ") : ''}
                            MenuProps={MenuProps}>
                        {categories.sort((a, b) => a.name > b.name ? 1 : -1)
                            .map(c => <MenuItem key={c.id} value={c.id}>
                                <Checkbox checked={filter.categories.includes(c.id)}/>
                                <ListItemText primary={c.name}/>
                            </MenuItem>)}
                    </Select>
                </FormControl>
                <div className={classes.ingredientsBlock}>
                    <TextField variant="standard" placeholder={"Игредиенты"} inputRef={ingredientInput}
                               className="margin-bottom-5"
                               onClick={e => {
                                   e.stopPropagation();
                                   e.preventDefault();
                               }}
                               onFocus={() => {
                                   ingredientsVariants.current.style.display = "block"
                               }}
                               onChange={(e) => {
                                   setIngredientsFilter(e.target.value)
                               }}/>
                    <div className={classes.ingredientsVariants} ref={ingredientsVariants}>
                        {ingredients.filter(i => ingredientsFilter ? i.name.toLowerCase().includes(ingredientsFilter.toLowerCase()) : true)
                            .map(i => <div key={i.id} className={classes.ingredientVariant}
                                           onClick={() => {
                                               ingredientInput.current.value = null
                                               setIngredientsFilter(null)
                                               ingredientsVariants.current.style.display = "none"
                                               setFilter('ingredients', [...new Set([...filter.ingredients, i.id])])
                                           }}>
                                {i.name}
                            </div>)}
                    </div>
                    <div className={classes.ingredients}>
                        {filter.ingredients.map(ingredientId => {
                                return <div key={ingredientId}
                                            onClick={() => {
                                                setFilter('ingredients', filter.ingredients.filter(i => i !== ingredientId))
                                            }}>
                                    {getIngredientNameById(ingredientId)}
                                </div>
                            }
                        )}
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
        : <div/>
}

Filter.propTypes = {
    setFilter: PropTypes.func,
    types: PropTypes.array,
    ingredients: PropTypes.array,
    categories: PropTypes.array,
    filter: PropTypes.object
}

export default Filter