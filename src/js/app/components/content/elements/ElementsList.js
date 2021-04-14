import React, {useEffect, useState} from 'react'
import clsx from 'clsx'
import {connect} from 'react-redux'
import Element from "./Element";
import AddElement from "./AddElement";
import ElementModal from "./ElementModal";
import {convertObjectToQueryString} from "../../../controls/Convert";
import axios from "axios";
import PropTypes, {element} from "prop-types";
import {
    setBreadcrumbs,
    setCancelToken,
    setDialogModal,
    setFavoritesList,
} from "../../../../redux/actions";
import FoldersModal from "../../../controls/modal/FoldersModal";
import {getFavorites} from "../../../controls/InitialRequests";
import ListModal from "./lists/ListModal";

function ElementsList(props) {
    const id = props.id || location.pathname.split("/").filter(l => l).reverse()[0] || null

    const [elements, setElements] = useState(null)
    const [editableElement, setEditableElement] = useState(null)
    const [viewedElement, setViewedElement] = useState(null)
    const [modal, setModal] = useState(null)

    const isSearchPage = id === 'search'

    const {setDialogModal, elementTypes, listTypes, setBreadcrumbs, nameString, setCancelToken, setFavoritesList} = props;

    useEffect(() => {
        selectMethod();
    }, [props.id, id])

    useEffect(() => {
        if (isSearchPage) {
            searchElements()
        }
    }, [nameString])

    function selectMethod() {
        if (isSearchPage) searchElements();
        else getElements();
    }

    function getElements() {
        const q = convertObjectToQueryString({
            parentId: id
        })

        axios.get('elements' + q)
            .then(r => {
                const {elements, parentsChain} = r.data
                setBreadcrumbs(parentsChain)
                setElements([...elements])
            })
            .catch((e) => {
                setElements([...[]])
            })
    }

    function searchElements() {
        const cancelTokenSource = axios.CancelToken.source();
        const q = convertObjectToQueryString({
            nameString
        })

        setCancelToken({name: "search", token: cancelTokenSource})
        axios.get('elements/search' + q, {
            cancelToken: cancelTokenSource.token
        })
            .then(r => {
                const {elements} = r.data
                setElements([...elements])
            })
        // .catch(() => setElements([...[]]))
    }

    function sendElement(element) {
        axios({
            url: 'element',
            method: element.method,
            data: {
                id: element.elementId || null,
                parentId: id,
                typeId: element.type.id,
                listTypeId: element.type.type === "list" ? element.listType.id : null,
                name: element.name,
                description: element.description,
            }
        }).then(() => {
            getFavorites(setFavoritesList)
            selectMethod()
        })
    }

    function fastElement(element) {
        axios({
            url: 'element',
            method: 'post',
            data: {
                parentId: id,
                typeId: element.type.id,
                listTypeId: element.type.type === "list" ? element.listType.id : null,
            }
        }).then(getElements)
    }

    function deleteElement(id) {
        if (!id) return;
        const q = convertObjectToQueryString({
            id: id
        })
        axios.delete('element' + q)
            .then(() => {
                getFavorites(setFavoritesList)
                selectMethod()
            })
            .catch(error => {
                if (error?.response?.data?.message) setDialogModal({
                    open: true,
                    message: error.response.data.message,
                    agreeButton: false,
                    cancelButtonText: "Хорошо"
                })
            })
    }

    function relocateElementModal(element) {
        setModal(<FoldersModal onClose={() => setModal(null)}
                               excludeIds={[element.id, id]}
                               excludeChildrenOfIds={[element.id]}
                               onSelectFolder={(f) => {
                                   setDialogModal({
                                       open: true,
                                       agree: () => {
                                           setModal(null)
                                           relocateElement({elementId: element.id, newParentId: f.id})
                                       },
                                       message: `Переместить "${element.name}" в "${f.name}"`
                                   })
                               }}/>)
    }

    function relocateElement({elementId, newParentId}) {
        axios.put('element/parent', {id: elementId, parentId: newParentId})
            .then(selectMethod)
    }

    function setFavoriteElement({elementId, isFavorite}) {
        axios.put('element/favorite', {id: elementId, isFavorite})
            .then(() => {
                getFavorites(setFavoritesList)
                selectMethod()
            })
    }

    return <div className={clsx("elements-list-block")}>
        {!isSearchPage && <AddElement onClick={() => {
            setEditableElement({method: 'post'})
        }}
                                      fastFolder={() => fastElement({
                                          type: elementTypes.find(t => t.type === 'folder')
                                      })}
                                      fastElement={() => fastElement({
                                          type: elementTypes.find(t => t.type === 'list'),
                                          listType: listTypes.find(t => t.type === 'notes')
                                      })}/>}
        {elements && elements.map(e => <Element element={e}
                                                key={e.id}
                                                onEdit={() => {
                                                    setEditableElement({...e, elementId: e.id, method: 'put'})
                                                }}
                                                onDelete={() => {
                                                    setDialogModal({
                                                        ...e,
                                                        open: true,
                                                        agree: () => deleteElement(e.id),
                                                        title: "Внимание",
                                                        message: `Вы хотите удалить "${e.name}"?`
                                                    })
                                                }}
                                                onSetFavorite={(isFavorite) => setFavoriteElement({
                                                    elementId: e.id,
                                                    isFavorite
                                                })}
                                                onRelocate={() => {
                                                    relocateElementModal(e)
                                                }}
                                                onOpenList={() => setViewedElement(e)}/>)}
        {editableElement && <ElementModal close={() => setEditableElement(null)}
                                          onSave={sendElement}
                                          editableElement={editableElement}/>}
        {viewedElement && <ListModal list={viewedElement}
                                     close={() => setViewedElement(null)}/>}
        {modal}
    </div>
}

ElementsList.propTypes = {
    setDialogModal: PropTypes.func,
    setCancelToken: PropTypes.func,
    setBreadcrumbs: PropTypes.func,
    setFavoritesList: PropTypes.func,
    elementTypes: PropTypes.array,
    listTypes: PropTypes.array,
    nameString: PropTypes.string,
}
const mapStateToProps = (state) => ({
    elementTypes: state.elementTypes,
    nameString: state.nameString,
    listTypes: state.listTypes
})
const mapDispatchToProps = (dispatch) => ({
    setDialogModal: v => dispatch(setDialogModal(v)),
    setBreadcrumbs: breadcrumbs => dispatch(setBreadcrumbs(breadcrumbs)),
    setCancelToken: cancelToken => dispatch(setCancelToken(cancelToken)),
    setFavoritesList: favoritesList => dispatch(setFavoritesList(favoritesList))
});


export default connect(mapStateToProps, mapDispatchToProps)(ElementsList)