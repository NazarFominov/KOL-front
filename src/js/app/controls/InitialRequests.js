import axios from 'axios'

export function getTypes(callback) {
    axios.get('types/element')
        .then(({data}) => {
            callback(data)
        })
}

export function getListTypes(callback) {
    axios.get('types/list')
        .then(({data}) => {
            callback(data)
        })
}

export function getFavorites(callback) {
    axios.get('elements/favorites')
        .then(r => {
            const {elements} = r.data
            callback([...elements])
        })
        .catch(() => callback([...[]]))
}