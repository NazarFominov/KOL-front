import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {convertQueryStringToObject} from "../../../controls/Convert";
import SecretKey from "./SecretKey";
import Redirect from "react-router-dom/Redirect";
import Themes from "./Themes";
import {VpnKey, Person, Palette, InsertEmoticon, Warning} from '@material-ui/icons';
import {connect} from "react-redux";
import {runOnKeys} from "../../../controls/SimpleFunctions";
import SecretPart from "./secretPart/SecretPart";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel"
             style={{width: 'calc(100% - 170px)'}}
             hidden={value !== index}
             id={`vertical-tabpanel-${index}`}
             aria-labelledby={`vertical-tab-${index}`}
             {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        paddingTop: 25,
        // height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        minWidth: 170
    },
}));

function Settings({isMobile}) {
    const classes = useStyles();
    const [value, setValue] = React.useState((() => {
        if (location.search) {
            const search = convertQueryStringToObject(location.search);
            return search.hasOwnProperty('tab') ? parseInt(search.tab) : 0
        }
        return 0
    })());
    const [redirect, setRedirect] = useState(null)
    const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem("isAdminMode")))

    useEffect(() => {
        if (location.search) {
            const s = convertQueryStringToObject(location.search);
            if (s.hasOwnProperty('tab')) setValue(parseInt(s.tab))
        }
    }, [location.search])

    useEffect(() => {
        runOnKeys(changeIsAdmin, "KeyS", "KeyE", "KeyC", "KeyR")
    }, [isAdmin])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function changeIsAdmin() {
        setIsAdmin(isAdmin + 1)
    }

    return (
        <div className={classes.root}>
            <Tabs orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  className={classes.tabs}>
                <Tab icon={isMobile ? <VpnKey fontSize={"large"}/> : null}
                     label={isMobile ? null : "Секретный код"}
                     onClick={() => setRedirect('/settings?tab=0')}/>
                <Tab icon={isMobile ? <Person fontSize={"large"}/> : null}
                     label={isMobile ? null : "Профиль"}
                     onClick={() => setRedirect('/settings?tab=1')}/>
                <Tab icon={isMobile ? <Palette fontSize={"large"}/> : null}
                     label={isMobile ? null : "Темы"}
                     onClick={() => setRedirect('/settings?tab=2')}/>
                {isAdmin === 3 && <Tab icon={<Warning fontSize={"large"}/>}
                                       onClick={() => setRedirect('/settings?tab=3')}/>}
            </Tabs>
            <TabPanel value={value} index={0}><SecretKey/></TabPanel>
            <TabPanel value={value} index={1}>
                Добавлю, как будет смысл <InsertEmoticon style={{verticalAlign: "middle"}} fontSize={"large"}/>
            </TabPanel>
            <TabPanel value={value} index={2}><Themes/></TabPanel>
            {isAdmin === 3 && <TabPanel value={value} index={3}><SecretPart/></TabPanel>}
            {redirect && <Redirect to={redirect}/>}
        </div>
    );
}

Settings.propTypes = {
    isMobile: PropTypes.bool,
}
const mapStateToProps = state => ({
    isMobile: state.isMobile
})
const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Settings)