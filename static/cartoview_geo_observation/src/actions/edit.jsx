export function resourceSelect( id ) {
    return {
        type: 'SELECT_RESOURCE',
        selectedResource: id
    }
}
export function setSetp( step ) {
    return {
        type: 'SET_STEP',
        step
    }
}
export function updateConfig( config ) {
    return {
        type: 'UPDATE_CONFIGURATION',
        config
    }
}