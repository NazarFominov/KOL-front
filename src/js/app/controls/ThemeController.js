import React, {useEffect, useState} from 'react'
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import {createMuiTheme} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {themes} from './constants/themes'

function ThemeController({currentTheme, children}) {
    const [theme, setTheme] = useState(createMuiTheme((themes.find(t => t.name === currentTheme) || themes[0]).theme));

    useEffect(() => {
        setTheme(createMuiTheme((themes.find(t => t.name === currentTheme) || themes[0]).theme))
    }, [currentTheme])

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}


ThemeController.propTypes = {
    currentTheme: PropTypes.string,
}
const mapStateToProps = state => ({
    currentTheme: state.theme
})
const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeController)