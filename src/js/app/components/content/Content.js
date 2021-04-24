import React, {useEffect} from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import {connect} from 'react-redux'
import {Container} from "@material-ui/core";
import Settings from "./settings/Settings";
import ElementsList from "./elements/elementsList/ElementsList";
import NotFound from "./404";
import {getDigitalParam} from "../../controls/SimpleFunctions";
import PropTypes from "prop-types";
import DialogModal from "../../controls/modal/DialogModal";

function Content(props) {
    const {dialogModal, warningModal} = props;

    useEffect(() => {
        console.log(warningModal)
    }, [warningModal])

    return <Container>
        <Switch>
            <Route path={'/settings'} component={Settings}/>
            <Route paths={['/', '/search', '/:id']} render={() => {
                if (location.pathname === "/") return <ElementsList/>
                else {
                    const id = location.pathname.split("/").filter(l => l).reverse()[0]
                    if (id.length === 24 || id === 'search') return <ElementsList id={id}/>
                    return <NotFound/>
                }
            }}/>
            <Route component={NotFound}/>
        </Switch>
        {dialogModal.open && <DialogModal/>}
    </Container>
}

Content.propTypes = {
    dialogModal: PropTypes.object,
}
const mapStateToProps = (state) => ({
    dialogModal: state.dialogModal,
})
const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Content)