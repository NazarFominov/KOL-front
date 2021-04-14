import React from 'react';
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {connect} from "react-redux";
import {setDialogModal} from "../../../redux/actions";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    dialog: {
        '& MuiDialog-paperScrollPaper': {
            minHeight: 300,
        }
    }
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DialogModal(props) {
    const classes = useStyles();

    const {disableDialogModal} = props;
    const dialogModal = {
        cancelButton: true,
        agreeButton: true,
        cancelButtonText: "Отмена",
        agreeButtonText: "Да",
        title: "Внимание!",
        ...props.dialogModal
    }

    return <Dialog open={true}
                   fullWidth={true}
                   TransitionComponent={Transition}
                   keepMounted
                   onClose={disableDialogModal}
                   aria-labelledby="alert-dialog-slide-title"
                   aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title">{dialogModal.title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">{dialogModal.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
            {dialogModal.cancelButton && <Button onClick={disableDialogModal} color="primary">
                {dialogModal.cancelButtonText}
            </Button>}
            {dialogModal.agreeButton && <Button onClick={() => {
                disableDialogModal()
                dialogModal.agree()
            }} color="primary">
                {dialogModal.agreeButtonText}
            </Button>}
        </DialogActions>
    </Dialog>
}

DialogModal.propTypes = {
    dialogModal: PropTypes.object,
    disableDialogModal: PropTypes.func
}
const mapStateToProps = (state) => ({
    dialogModal: state.dialogModal
})
const mapDispatchToProps = (dispatch) => ({
    disableDialogModal: () => dispatch(setDialogModal({}))
});


export default connect(mapStateToProps, mapDispatchToProps)(DialogModal)