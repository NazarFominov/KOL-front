import React from 'react'
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

import '../../../css/Preloader.scss'

const useStyles = makeStyles((theme) => ({
    cube: {
        "&::before": {backgroundColor: settings => theme.palette[settings.color][settings.shade]}
    }
}))

export default function Preloader({color = 'primary', shade = 'main'}) {
    const classes = useStyles({color, shade});

    return <div className="sk-folding-cube">
        {[1, 2, 4, 3].map(c => <div key={c} className={clsx(`sk-cube sk-cube-${c}`, classes.cube)}/>)}
    </div>
}