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

function IngredientTypes(props) {
    const classes = useStyles()

    const [newTypes, setNewTypes] = useState([{}]);
    const [filter, setFilter] = useState(null);

    const [recipeIngredients, setRecipeIngredients] = useState(null)

    useEffect(() => {
        getIngredientTypes();
    }, [])

    useEffect(() => {
        if (!newTypes) setNewTypes([{}])
    }, [newTypes])

    function getIngredientTypes() {
        axios.get('recipe/ingredients')
            .then(({data}) => setRecipeIngredients([...data]))
    }

    function addIngredientType() {
        newTypes.filter(t => t.name).forEach(async t => {
            await axios.post('recipe/ingredient', t)
        })

        setNewTypes(null)

        getIngredientTypes();

    }

    return <div className="settings-secret-part">
        <div>
            <h3>Добавить новый ингридиент рецепта</h3>
            <div className={classes.recipeIngredientBlock}>
                {newTypes && newTypes.map((t, i) => <div>
                    <TextField label="Название" color="primary"
                               onChange={(e) => {
                                   if (newTypes.length - 1 === i) newTypes.push({})
                                   newTypes[i].name = e.target.value;
                                   setNewTypes([...newTypes])
                               }}
                               className={classes.input} variant="standard"/>
                </div>)}
                <Button className={classes.iconButton} onClick={addIngredientType}>
                    Добавить
                </Button>
            </div>
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            <TextField label="Фильтр" onChange={e => setFilter(e.target.value || null)}/>
            <div className="display-table width-100">
                {recipeIngredients && recipeIngredients.sort((a, b) => a.name > b.name ? 1 : -1).filter(i => filter ? i.name.toLowerCase().includes(filter.toLowerCase()) : true).map((t, i) =>
                    <div>
                        <div className="margin-right-10">{i + 1}</div>
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