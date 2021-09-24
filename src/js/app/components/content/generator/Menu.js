import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import {setBreadcrumbs, setDialogModal} from "../../../../redux/actions";
import {makeStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import {Error as ErrorIcon,} from '@material-ui/icons'
import clsx from "clsx";
import {convertObjectToQueryString} from "../../../controls/Convert";
import {newObject} from "../../../controls/SimpleFunctions";

const useStyles = makeStyles((theme) => ({
    menuFilter: {
        marginTop: 15,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        [theme.breakpoints.down(519)]: {
            flexDirection: 'column',
        },
        '& .selectRecipeList': {
            margin: theme.spacing(1),
            width: 300,
            marginRight: 20,
            [theme.breakpoints.down(519)]: {
                width: '100%',
                margin: 0,
                marginBottom: 20
            },
        },

        '& button': {
            height: 48,
            [theme.breakpoints.down(519)]: {
                width: '100%',
            },
        },

        '& .recipeTypes': {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: 20,

            '& >*': {
                marginRight: 10,
                marginBottom: 10,
                width: 'calc(25% - 10px)',
                maxWidth: 200,

                [theme.breakpoints.down(400)]: {
                    marginRight: 10,
                    width: 'calc(50% - 10px)',
                },
            }
        }
    },
    errorRecipesList: {
        background: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        margin: theme.spacing(1),
        padding: '5px 10px',
        borderRadius: 4,
        display: "inline-block",
        fontSize: 18,

        '& >*': {
            verticalAlign: 'middle'
        }
    }
}));

function Menu(props) {
    const classes = useStyles();

    const {setBreadcrumbs, setDialogModal} = props;

    const [recipeListId, setRecipeListId] = useState(null)
    const [availableRecipesLists, setAvailableRecipesLists] = useState(null)
    const [recipeTypes, setRecipeTypes] = useState(null)
    const [recipes, setRecipes] = useState(null)

    useEffect(() => {
        setBreadcrumbs([{id: null}, {id: 'generator/menu', name: "Генератор меню"}])
        getRecipesLists();
        getRecipeTypes();
    }, [])

    function getRecipeTypes() {
        axios.get('recipe/types').then(({data}) => setRecipeTypes(data.map(d => ({...d, count: 0}))))
    }

    function getRecipesLists() {
        axios.get('elements/recipes').then(({data}) => setAvailableRecipesLists([...data]))
    }

    function generateMenu() {
        if (!recipeListId) {
            setDialogModal({
                open: true,
                message: 'Выберите список рецептов!',
                agreeButton: false,
                cancelButtonText: "Хорошо"
            })
        } else if (recipeTypes.every(t => !t.count)) {
            setDialogModal({
                open: true,
                message: 'Укажите количество хотя бы одного типа рецепта!',
                agreeButton: false,
                cancelButtonText: "Хорошо"
            })
        } else {
            const q = convertObjectToQueryString(Object.assign(
                {id: recipeListId},
                ...recipeTypes.map(t => ({[t.type]: t.count || 0}))
            ))
            axios.get('generator/menu' + q)
                .then(({data}) => setRecipes(newObject(data)))
        }
    }

    return <div>
        {recipeTypes && availableRecipesLists ? recipeTypes.length && availableRecipesLists.length ?
            <div className={classes.menuFilter}>
                <FormControl className="selectRecipeList">
                    <InputLabel id="recipe-select">Список рецептов</InputLabel>
                    <Select labelId="recipe-select"
                            value={recipeListId}
                            onChange={(e, {props}) => setRecipeListId(props.value)}>
                        {availableRecipesLists.map(({id, name}) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button color="primary" variant="contained" onClick={generateMenu}>
                    Сгенерировать
                </Button>
                <div className="recipeTypes">
                    {recipeTypes.map((t, i) => <TextField variant={"outlined"} color={"primary"}
                                                          label={t.name} value={t.count}
                                                          type={'number'} min={0}
                                                          onChange={(e) => {
                                                              recipeTypes[i].count = Math.abs(parseInt(e.target.value));
                                                              setRecipeTypes([...recipeTypes]);
                                                          }}/>)}
                </div>
            </div>
            : <div className={classes.errorRecipesList}>
                <ErrorIcon className={clsx('margin-right-5')}/>
                <span>Создайте хотя бы один список рецептов!</span>
            </div> : null}
        {recipes && Object.keys(recipes).map(key => <div
            style={{marginBottom: 10}}>{recipes[key].map(r => r.name).join(', ')}</div>)}
    </div>
}

Menu.propTypes = {
    setBreadcrumbs: PropTypes.func,
    setDialogModal: PropTypes.func,
}
const mapStateToProps = state => ({})
const mapDispatchToProps = (dispatch) => ({
    setBreadcrumbs: breadcrumbs => dispatch(setBreadcrumbs(breadcrumbs)),
    setDialogModal: v => dispatch(setDialogModal(v)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Menu)