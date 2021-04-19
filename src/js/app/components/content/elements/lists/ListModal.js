import React, {useEffect, useState} from 'react'
import Notes from "./Notes";
import PropTypes from 'prop-types'
import Preloader from "../../../../controls/Preloader";
import Recipes from "./recipe/Recipes";

function ListModal(props) {
    const {list, close} = props;

    switch (list.listType.type) {
        case 'notes':
            return <Notes list={list}
                          close={close}/>
        case 'recipes':
            return <Recipes list={list}
                            close={close}/>
    }

}

ListModal.propTypes = {
    list: PropTypes.object,
    close: PropTypes.func
}

export default ListModal