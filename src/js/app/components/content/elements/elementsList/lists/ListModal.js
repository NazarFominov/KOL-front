import React, {useEffect, useState} from 'react'
import Notes from "./Notes";
import {Menu} from "./menu/Menu";
import PropTypes from 'prop-types'
import Recipes from "./recipe/Recipes";
import MenuWrapper from "./menu/MenuWrapper";

function ListModal(props) {
    const {list, close} = props;

    switch (list.listType.type) {
        case 'notes':
            return <Notes list={list}
                          close={close}/>
        case 'recipes':
            return <Recipes list={list}
                            close={close}/>
        case 'menu':
            return <MenuWrapper list={list}
                                close={close}/>
    }

}

ListModal.propTypes = {
    list: PropTypes.object,
    close: PropTypes.func
}

export default ListModal