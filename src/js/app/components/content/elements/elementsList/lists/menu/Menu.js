import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Popover} from "@material-ui/core";
import axios from "axios";
import {Add as AddIcon, Cached as CachedIcon, Clear as ClearIcon} from '@material-ui/icons'
import RecipeElement from "../recipe/RecipeElement";
import {newObject} from "../../../../../../controls/SimpleFunctions";

const useStyles = makeStyles((theme) => ({
    menu: props => ({
        '& >*': {
            marginBottom: 25,

            '& >.categoryName': {
                marginBottom: 10
            },
            '& >.variant': {
                marginBottom: 10,
                display: 'flex',
                flexWrap: 'wrap',

                '& .recipeElementBlock': {
                    minWidth: 320,
                    flexGrow: 1,
                    marginRight: props.marginRecipe,
                    marginBottom: props.marginRecipe,
                    position: "relative",
                    overflow: "hidden",
                    '& >.sash': {
                        position: "absolute",
                        zIndex: 1300,
                        top: 0,
                        left: -128,
                        width: 128,
                        height: 52,
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary.contrastText,
                        display: "flex",
                        alignItems: "center",
                        borderTopLeftRadius: 4,
                        borderBottomLeftRadius: 4,
                        transitionProperty: 'left',
                        transitionDuration: '400ms',

                        '& >button': {
                            height: '100%'
                        }
                    },
                    '& >.recipe-element': {
                        marginTop: 0,
                        marginBottom: 0,
                    },
                },
                '& .recipeElementBlock:hover': {
                    '& >.sash': {
                        left: 0
                    }
                },
                '& >button': {
                    flexGrow: 1,
                    marginRight: props.marginRecipe,
                    marginBottom: props.marginRecipe
                },
            }
        }
    }),
    popover: {
        '& >*': {
            margin: 5,
            padding: '5px 10px',
            cursor: 'pointer',
        },
        '& >*:hover': {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.contrastText,
        }
    }
}));

export function Menu(props) {
    const marginRecipe = 5;
    const classes = useStyles({marginRecipe: marginRecipe, variantsLength: 1});

    const {renderControls, getNewRecipe, onChangeMenu, classNameRecipe} = props;

    const [menu, setMenu] = useState(null)

    const [recipeTypes, setRecipeTypes] = useState(props.recipeTypes)
    const [recipeCategories, setRecipeCategories] = useState(props.recipeCategories)

    useEffect(() => {
        if (!recipeTypes) getRecipeTypes();
        if (!recipeCategories) getRecipeCategories();
    }, [])

    useEffect(() => {
        setMenu(props.menu)
    }, [props.menu])

    useEffect(() => {
        onChangeMenu(menu)
    }, [menu])

    function getRecipeTypes() {
        axios.get('recipe/types').then(({data}) => setRecipeTypes(data.map(d => ({...d, count: 0}))))
    }

    function getRecipeCategories() {
        axios.get('recipe/categories').then(({data}) => setRecipeCategories(data))
    }

    function clearRecipe(type, variantIndex, recipeIndex) {
        menu[type][variantIndex].splice(recipeIndex, 1);
        if (!menu[type][variantIndex].length) menu[type].splice(variantIndex, 1)
        setMenu(newObject(menu))
    }

    async function changeRecipe(type, category, variantIndex, recipeIndex) {
        const recipe = await getNewRecipe(category ? null : type, category);
        if (recipe) {
            menu[type][variantIndex][recipeIndex] = {
                ...recipe,
                degree: category ? 'additional' : 'basic',
                requestedCategory: category ? category : null
            };
            setMenu(newObject(menu))
        }
    }

    async function addRecipe(type, category, variantIndex) {
        const recipe = await getNewRecipe(null, category);
        if (recipe) {
            menu[type][variantIndex].push({...recipe, degree: 'additional', requestedCategory: category});
            setMenu(newObject(menu))
        }
    }

    function PopoverBlock(props) {
        const [open, setOpen] = useState(false);

        const {type, variantIndex} = props;

        return renderControls ? <React.Fragment>
            <Button id={props.id} color={"secondary"} variant={"contained"}
                    onClick={() => setOpen(true)}>
                <AddIcon/>
            </Button>
            {recipeCategories && <Popover open={open}
                                          onClick={() => setOpen(false)}
                                          anchorEl={document.getElementById(props.id)}
                                          anchorOrigin={{
                                              vertical: 'bottom',
                                              horizontal: 'left',
                                          }}
                                          transformOrigin={{
                                              vertical: 'top',
                                              horizontal: 'left',
                                          }}>
                <div className={classes.popover}>
                    {recipeCategories.map(c => <div key={c.id} onClick={() => addRecipe(type, c.type, variantIndex)}>
                        {c.name}
                    </div>)}
                </div>
            </Popover>}
        </React.Fragment> : null
    }

    return recipeTypes && menu ? <div className={classes.menu}>
        {Object.keys(menu).map(type => {
            return menu[type].length ? <div key={type}>
                <h3 className="categoryName">{(recipeTypes.find(t => t.type === type) || {name: type}).name}</h3>
                {menu[type].map((variant, i) => <div className={'variant'} key={i}>
                    {variant.map((recipe, j) => <div className="recipeElementBlock"
                                                     style={{
                                                         width: `calc(${100 / variant.length}% - ${marginRecipe}px - ${renderControls ? (64 + marginRecipe) / variant.length : 0}px)`
                                                     }}>
                        {renderControls && <div className="sash">
                            <Button color={"secondary"} variant={"contained"}
                                    onClick={() => clearRecipe(type, i, j)}>
                                <ClearIcon/>
                            </Button>
                            <Button color={"secondary"} variant={"contained"}
                                    onClick={() => {
                                        const c = recipe.degree === 'additional' ? recipe.requestedCategory : null;
                                        // noinspection JSIgnoredPromiseFromCall
                                        changeRecipe(type, c, i, j)
                                    }}>
                                <CachedIcon/>
                            </Button>
                        </div>}
                        <RecipeElement recipe={recipe}
                                       className={classNameRecipe}
                                       showControls={false}/>
                    </div>)}
                    <PopoverBlock id={type + variant.id + i} type={type} variantIndex={i}/>
                </div>)}
            </div> : null
        }).filter(el => el)}
    </div> : null
}

Menu.defaultProps = {
    renderControls: true,
    classNameRecipe: '',
    getNewRecipe: () => null,
    onChangeMenu: () => null,
}

Menu.propTypes = {
    recipeTypes: PropTypes.array,
    recipeCategories: PropTypes.array,
    menu: PropTypes.object,
    renderControls: PropTypes.bool,
    getNewRecipe: PropTypes.func,
    onChangeMenu: PropTypes.func,
    classNameRecipe: PropTypes.string,
}