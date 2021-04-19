import React from "react";
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

const useStyles = makeStyles((theme) => ({
    typesAndCategories: {
        opacity: 0.75
    },
    ingredient: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    // type: {
    //     borderStyle: "dotted !important"
    // },
    // category: {
    //     borderStyle: "solid !important"
    // },


    difficultyLevel1: {
        backgroundColor: theme.palette.primary.light
    },
    difficultyLevel2: {
        backgroundColor: theme.palette.primary.main
    },
    difficultyLevel3: {
        backgroundColor: theme.palette.primary.dark
    },

    loveLevelIcon: {
        fontSize: 45
    },
    link: {
        color: theme.palette.secondary.main
    }
}));


function RecipeFormBlock(props) {
    const {recipe, onDelete} = props

    const classes = useStyles();

    return <div className="recipe-element">
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography className="flex-grow-1 margin-right-10"
                            style={{fontSize: 16}}>{recipe.name}</Typography>
                <div className="recipe-short-description margin-bottom-5 margin-top-5">
                    <span className={classes.typesAndCategories}>
                        {recipe.types && Boolean(recipe.types.length) && (recipe.types.map(el => el.name).join(", ").toLowerCase() + " | ")}
                        {recipe.categories.map(el => el.name).join(", ").toLowerCase()}
                    </span>
                    {/*{recipe.types.map(t => <div key={t.id}*/}
                    {/*                            className={classes.type}>{t.name}</div>)}*/}
                    {/*{recipe.categories.map(c => <div key={c.id}*/}
                    {/*                                 className={classes.category}>{c.name}</div>)}*/}
                </div>
            </AccordionSummary>
            <AccordionDetails className="recipe-fields">
                <div className="difficulty" title={`Сложность - ${recipe.difficulty}`}>
                    <div className={clsx(classes.difficultyLevel1, recipe.difficulty >= 1 ? "active" : "")}/>
                    <div className={clsx(classes.difficultyLevel2, recipe.difficulty >= 2 ? "active" : "")}/>
                    <div className={clsx(classes.difficultyLevel3, recipe.difficulty >= 3 ? "active" : "")}/>
                </div>
                <div className="love-level" title={`Любимость - ${recipe.loveLevel}`}>
                    {(() => {
                        switch (recipe.loveLevel) {
                            case 1:
                                return <MoodBad className={classes.loveLevelIcon}/>
                            case 2:
                                return <SentimentVeryDissatisfied className={classes.loveLevelIcon}/>
                            case 3:
                                return <SentimentSatisfied className={classes.loveLevelIcon}/>
                            case 4:
                                return <SentimentSatisfiedAlt className={classes.loveLevelIcon}/>
                            case 5:
                                return <InsertEmoticon className={classes.loveLevelIcon}/>
                        }
                    })()}
                </div>
                {recipe.link && <a className={clsx("link", classes.link)}
                                   href={recipe.link} target='_blank' rel="noopener noreferrer">Ссылка на рецепт</a>}
                {recipe.ingredients && <div className="ingredients">
                    {recipe.ingredients.map(i => <div key={i.id} className={classes.ingredient}>{i.name}</div>)}
                </div>}
                {recipe.note && <div className="note">{recipe.note}</div>}
                <div className="action-buttons">
                    <IconButton>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={onDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </AccordionDetails>
        </Accordion>
    </div>
}

RecipeFormBlock.propTypes = {
    recipe: PropTypes.object,
    onDelete: PropTypes.func
}

export default RecipeFormBlock