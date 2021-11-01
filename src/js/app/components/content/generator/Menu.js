import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import {setBreadcrumbs, setDialogModal} from "../../../../redux/actions";
import {makeStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import {Error as ErrorIcon, Add as AddIcon} from '@material-ui/icons'
import clsx from "clsx";
import {convertObjectToQueryString} from "../../../controls/Convert";
import {newObject} from "../../../controls/SimpleFunctions";
import {Menu as MenuList} from '../elements/elementsList/lists/menu/Menu';
import {getFavorites} from "../../../controls/InitialRequests";
import FoldersModal from "../../../controls/modal/FoldersModal";

const useStyles = makeStyles((theme) => ({
    menuFilter: {
        marginTop: 15,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        [theme.breakpoints.down(715)]: {
            flexDirection: 'column',
        },
        '& .selectRecipeList': {
            margin: theme.spacing(1),
            width: 300,
            marginRight: 20,
            [theme.breakpoints.down(715)]: {
                width: '100%',
                margin: 0,
                marginBottom: 20
            },
        },

        '& button': {
            height: 48,
            marginRight: 10,
            width: 160,
            [theme.breakpoints.down(715)]: {
                width: '100%',
                marginBottom: 10,
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
    },
    menu: {
        '& >*': {
            marginBottom: 25,

            '& >.categoryName': {
                marginBottom: 10
            },
            '& >.variant': {
                marginBottom: 10,
                display: 'flex',
                flexWrap: 'wrap',

                '& >.recipe-element': {
                    minWidth: 320,
                    flexGrow: 1,
                },
                '& >button': {
                    flexGrow: 1,
                }
            }
        }
    }
}));

function Menu(props) {
    const classes = useStyles();

    const {setBreadcrumbs, setDialogModal, elementTypeId, menuTypeId} = props;

    const [recipeListId, setRecipeListId] = useState(null);
    const [availableRecipesLists, setAvailableRecipesLists] = useState(null);
    const [recipeTypes, setRecipeTypes] = useState(null);
    const [recipeCategories, setRecipeCategories] = useState(null);
    const [menu, setMenu] = useState(null);
    const [saveMenu, setSaveMenu] = useState(null);
    const [modal, setModal] = useState(null);
    const [savedId, setSavedId] = useState(null);

    useEffect(() => {
        setBreadcrumbs([{id: null}, {id: 'generator/menu', name: "Генератор меню"}])
        getRecipesLists();
        getRecipeTypes();
        getRecipeCategories();
    }, [])

    function getRecipeTypes() {
        axios.get('recipe/types').then(({data}) => setRecipeTypes(data.map(d => ({...d, count: 0}))))
    }

    function getRecipeCategories() {
        axios.get('recipe/categories').then(({data}) => setRecipeCategories(data))
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
            setSaveMenu(null)
            setSavedId(null)
            const q = convertObjectToQueryString(Object.assign(
                {id: recipeListId},
                ...recipeTypes.map(t => ({[t.type]: t.count || 0}))
            ))
            axios.get('generator/menu' + q)
                .then(({data}) => setMenu(newObject(data)))
        }
    }

    async function generateRecipe(type, category) {
        type = recipeTypes.find(t => t.type === type);
        category = recipeCategories.find(c => c.type === category);

        const q = convertObjectToQueryString({
            id: recipeListId,
            typeId: type?.id || null,
            categoryId: category?.id || null,
        })
        const recipe = await axios.get('generator/recipe' + q);

        if (!recipe.data) {
            setDialogModal({
                open: true,
                message: `Рецепта ${[type?.name || null, category?.name || null].filter(el => el)} не найдено в нашей базе`,
                agreeButton: false,
                cancelButtonText: "Хорошо"
            })
        }

        return recipe.data ? recipe.data : null
    }

    function onChangeMenu(changedMenu) {
        if (changedMenu) {
            changedMenu = newObject(changedMenu)

            Object.keys(changedMenu).forEach(key => {
                changedMenu[key] = changedMenu[key].map(el => el.map(e => e.id))
            })

            setSaveMenu(newObject(changedMenu))
        } else setSaveMenu(changedMenu)
    }

    function onSaveMenuModal() {
        setModal(<FoldersModal onClose={() => setModal(null)}
                               onSelectFolder={(f) => {
                                   setDialogModal({
                                       open: true,
                                       agree: onCreateMenu,
                                       message: `Сохранить это меню в "${f.name}"`
                                   })
                               }}/>)
    }

    async function onCreateMenu() {
        try {
            const element = await axios.post('element', {
                typeId: elementTypeId,
                listTypeId: menuTypeId,
                name: new Date().toLocaleString(),
            })

            setSavedId(element.data.id);

            await axios.put('list/menu', {
                id: element.data.id || null,
                menu: saveMenu
            })
        } catch (e) {
            console.log(e)
        } finally {
            setModal(null)

        }
    }

    function onSaveMenu() {
        axios.put('list/menu', {
            id: savedId,
            menu: saveMenu
        })
    }

    return <React.Fragment>
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
                {saveMenu && <Button color="primary" variant="contained"
                                     onClick={savedId ? onSaveMenu : onSaveMenuModal}>
                    Сохранить
                </Button>}
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
        <MenuList menu={menu}
                  recipeTypes={recipeTypes}
                  onChangeMenu={onChangeMenu}
                  recipeCategories={recipeCategories}
                  getNewRecipe={generateRecipe}/>
        {modal}
    </React.Fragment>
}

Menu.propTypes = {
    elementTypes: PropTypes.array,
    listTypes: PropTypes.array,
    setBreadcrumbs: PropTypes.func,
    setDialogModal: PropTypes.func,
}
const mapStateToProps = state => ({
    elementTypes: state.elementTypes,
    listTypes: state.listTypes,
    elementTypeId: state.elementTypes ? (state.elementTypes.find(t => t.type === 'list') || {id: null}).id : null,
    menuTypeId: state.listTypes ? (state.listTypes.find(t => t.type === 'menu') || {id: null}).id : null,
})
const mapDispatchToProps = (dispatch) => ({
    setBreadcrumbs: breadcrumbs => dispatch(setBreadcrumbs(breadcrumbs)),
    setDialogModal: v => dispatch(setDialogModal(v)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu)