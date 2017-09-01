import { featureIsLoading, features, totalFeatures } from './features'

import { combineReducers } from 'redux'
import { map } from './map'

export default combineReducers( {
    features,
    featureIsLoading,
    totalFeatures,
    map
} )
