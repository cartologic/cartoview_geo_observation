import {
    attachmentFilesIsLoading,
    featureIsLoading,
    features,
    files,
    searchMode,
    searchResult,
    searchResultIsLoading,
    searchTotalFeatures,
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
    files,
    searchMode,
    searchResult,
    searchResultIsLoading,
    searchTotalFeatures,
    attachmentFilesIsLoading,
    selectedFeatures

} )
