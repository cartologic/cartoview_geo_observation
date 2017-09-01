export function featureIsLoading( state = false, action ) {
    switch ( action.type ) {
    case 'FEATURES_IS_LOADING':
        return action.isLoading
    default:
        return state
    }
}
export function attachmentFilesIsLoading( state = false, action ) {
    switch ( action.type ) {
    case 'ATTACHMENT_FILES_IS_LOADING':
        return action.isLoading
    default:
        return state
    }
}
export function totalFeatures( state=0, action ) {
    switch ( action.type ) {
    case 'TOTAL_FEATURES':
        return action.totalFeatures
    default:
        return state
    }
}
export function selectedFeatures( state=[], action ) {
    switch ( action.type ) {
    case 'SET_SELECTED_FEATURES':
        return action.selectedFeatures
    default:
        return state
    }
}

export function features( state = [ ], action ) {
    switch ( action.type ) {
    case 'GET_FEATURES_SUCCESS':
        return action.features
    default:
        return state
    }
}
export function files( state = [ ], action ) {
    switch ( action.type ) {
    case 'GET_ATTACHMENT_FILES_SUCCESS':
        return action.files
    default:
        return state
    }
}
export function searchResultIsLoading( state = false, action ) {
    switch ( action.type ) {
    case 'SEARCH_RESULT_IS_LOADING':
        return action.isLoading
    default:
        return state
    }
}
export function searchTotalFeatures( state=0, action ) {
    switch ( action.type ) {
    case 'SEARCH_TOTAL_FEATURES':
        return action.searchTotalFeatures
    default:
        return state
    }
}
export function searchMode( state=false, action ) {
    switch ( action.type ) {
    case 'SEARCH_MODE':
        return action.searchMode
    default:
        return state
    }
}
export function selectMode( state=false, action ) {
    switch ( action.type ) {
    case 'SELECT_MODE':
        return action.selectMode
    default:
        return state
    }
}
export function searchResult( state = [ ], action ) {
    switch ( action.type ) {
    case 'SEARCH_SUCCESS':
        return action.searchResult
    default:
        return state
    }
}
