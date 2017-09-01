import {
    attachmentFilesIsLoading,
    featureIsLoading,
    features,
    files,
    searchMode,
    searchResult,
    searchResultIsLoading,
    searchTotalFeatures,
    selectMode,
    selectedFeatures,
    totalFeatures
} from './features'

import { combineReducers } from 'redux'
import { map } from './map'

export default combineReducers( {
    features,
    featureIsLoading,
    totalFeatures,
    map,
    selectMode,
    files,
    searchMode,
    searchResult,
    searchResultIsLoading,
    searchTotalFeatures,
    attachmentFilesIsLoading,
    selectedFeatures

} )
