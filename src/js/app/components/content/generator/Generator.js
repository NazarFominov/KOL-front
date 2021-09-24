import React from 'react'
import Route from "react-router-dom/Route";
import NotFound from "../404";
import Switch from "react-router-dom/Switch";
import Menu from "./Menu";

export default function Generator(){
return <Switch>
    <Route path={'/generator/menu'} component={Menu}/>
    <Route component={NotFound}/>
</Switch>
}