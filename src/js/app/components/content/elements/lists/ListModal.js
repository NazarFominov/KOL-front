import React, {useEffect, useState} from 'react'
import Notes from "./Notes";
import PropTypes from 'prop-types'
import Preloader from "../../../../controls/Preloader";

function ListModal(props) {
    const {list, close} = props;

    switch (list.listType.type) {
        case 'notes':
            return <Notes list={list}
                          close={close}/>
    }

}

ListModal.propTypes = {
    list: PropTypes.object,
    close: PropTypes.func
}

export default ListModal