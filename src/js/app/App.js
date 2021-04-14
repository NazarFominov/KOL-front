import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Header from "./components/header/Header";
import ThemeController from "./controls/ThemeController";
import axios from 'axios'
import Content from "./components/content/Content";
import {checkIsMobile} from "./controls/SimpleFunctions";
import Breadcrumbs from "./components/Breadcrumbs";
import Redirect from "react-router-dom/Redirect";

import {Lines} from 'react-preloaders';

import {
    setFavoritesList,
    setIp,
    setIsMobile,
    setListTypes,
    setSecretKey as dispatchSetSecretKey,
    setTypes
} from "../redux/actions";

import '../../css/Styles.scss'
import {getFavorites, getListTypes, getTypes} from "./controls/InitialRequests";

require('babel-polyfill');

const ip = `http://${process?.env?.NODE_IP || 'localhost'}:3000/api/`

function App(props) {
    const {setIsMobile, setTypes, setIp, secretKey, setSecretKey, setListTypes, setFavoritesList} = props

    setIp(ip)

    axios.interceptors.request.use(async function (config) {
        config.url = ip + config.url.replace(location.origin, "").replace(ip, "");

        if (props.secretKey) config.headers['Secret-Key'] = props.secretKey

        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(async function (response) {
        return response;
    }, function (error) {
        console.log(error);

        if (error?.response?.status === 401) setSecretKey(null)

        return Promise.reject(error);
    });

    window.addEventListener("resize", () => {
        setIsMobile(checkIsMobile())
    })

    useEffect(() => {
        getTypes(setTypes);
        getListTypes(setListTypes)
        getFavorites(setFavoritesList)
    }, [])

    useEffect(() => {
        const preloader = document.getElementById("preloader");
        if (preloader) preloader.style.zIndex = "-1";
    });

    return <ThemeController>
        <div className="kingdom-of-lists">
            <Header/>
            <Breadcrumbs/>
            <Content/>
        </div>
        {!secretKey && !location.pathname.includes("settings") && <Redirect to={'/settings?tab=0'}/>}
    </ThemeController>
}

App.propTypes = {
    setIp: PropTypes.func,
    setIsMobile: PropTypes.func,
    setTypes: PropTypes.func,
    setListTypes: PropTypes.func,
    secretKey: PropTypes.string,
    setSecretKey: PropTypes.func,
    setFavoritesList: PropTypes.func,
}
const mapStateToProps = state => ({
    theme: state.theme,
    secretKey: state.secretKey,
})
const mapDispatchToProps = (dispatch) => ({
    setIp: ip => dispatch(setIp(ip)),
    setIsMobile: isMobile => dispatch(setIsMobile(isMobile)),
    setTypes: types => dispatch(setTypes(types)),
    setListTypes: types => dispatch(setListTypes(types)),
    setSecretKey: types => dispatch(dispatchSetSecretKey(types)),
    setFavoritesList: favoritesList => dispatch(setFavoritesList(favoritesList))
});


export default connect(mapStateToProps, mapDispatchToProps)(App)