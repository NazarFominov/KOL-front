import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import RecipeTypes from "./RecipeTypes";
import RecipeCategory from "./RecipeCategory";
import IngredientTypes from "./IngredientTypes";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel"
             hidden={value !== index}
             id={`scrollable-auto-tabpanel-${index}`}
             aria-labelledby={`scrollable-auto-tab-${index}`}
             {...other}>
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SecretPart() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="scrollable auto tabs example">
                    <Tab label="Типы рецепта" {...a11yProps(0)} />
                    <Tab label="Категории рецепта" {...a11yProps(1)} />
                    <Tab label="Ингредиенты" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <RecipeTypes/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <RecipeCategory/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <IngredientTypes/>
            </TabPanel>
        </div>
    );
}