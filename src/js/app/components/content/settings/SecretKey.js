import React, {useRef, useState} from 'react'
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import {setSecretKey as dispatchSetSecretKey} from "../../../../redux/actions";

const useStyles = makeStyles((theme) => ({
    title: {
        marginBottom: 5,
        marginTop: 0
    },

    currentKeyBlock: {
        marginBottom: 20
    },

    currentKey: {
        marginTop: 0,
        letterSpacing: 2,
    },

    secretField: {
        width: 300,
        marginBottom: 5,

        '& input': {
            textAlign: 'center',
            fontSize: 20,
            textTransform: 'uppercase'
        },
    },
    addSecretButton: {
        width: 300,
        display: 'block'
    }

}));

function SecretKey(props) {
    const classes = useStyles()

    const secretKeyInput = useRef(null)

    const {secretKey, setSecretKey} = props
    let tempSecretKey = null;

    function changeSecretKey(event) {
        tempSecretKey = event.target.value.toUpperCase() || null
    }

    function saveSecretKey() {
        setSecretKey(tempSecretKey);
        tempSecretKey = null;
        secretKeyInput.current.getElementsByTagName('input')[0].value = null;
        location.reload()
    }

    return <React.Fragment>
        <div className={classes.currentKeyBlock}>
            <h4 className={classes.title}>Текущий код</h4>
            <h2 className={classes.currentKey}>{secretKey || "ОТСУТСТВУЕТ"}</h2>
        </div>
        <div>
            {/*<h4 className={classes.title}>Замена кода</h4>*/}
            <TextField label="Замена кода" color="primary"
                       ref={secretKeyInput}
                       onChange={changeSecretKey}
                       variant="outlined" className={classes.secretField}/>
            <Button variant="contained" color="primary" className={classes.addSecretButton}
                    onClick={saveSecretKey}>
                Сохранить
            </Button>
        </div>
    </React.Fragment>
}


SecretKey.propTypes = {
    secretKey: PropTypes.string,
    setSecretKey: PropTypes.func,
}
const mapStateToProps = state => ({
    secretKey: state.secretKey,
})
const mapDispatchToProps = (dispatch) => ({
    setSecretKey: key => dispatch(dispatchSetSecretKey(key))
});


export default connect(mapStateToProps, mapDispatchToProps)(SecretKey)