export function featureIsLoading( state = false, action ) {
    switch ( action.type ) {
    case 'FEATURES_IS_LOADING':
        return action.isLoading
    default:
        return state
    }
}
export function totalFeatures( state, action ) {
    switch ( action.type ) {
    case 'TOTAL_FEATURES':
        return action.totalFeatures
    default:
        return 0
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
