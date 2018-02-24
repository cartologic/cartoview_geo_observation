import { getCRSFToken } from 'Source/helpers/helpers.jsx'
import isURL from 'validator/lib/isURL'
export const doGet = ( url, extraHeaders = {} ) => {
    return fetch( url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "X-CSRFToken": getCRSFToken(),
            ...extraHeaders
        }
    } ).then( ( response ) => {
        return response.json()
    } )
}
export const capitalizeFirstLetter = ( string ) => {
    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}
export const doPost = ( url, data, extraHeaders = {}, type = 'json' ) => {
    return fetch( url, {
        method: 'POST',
        credentials: 'include',
        headers: new Headers( {
            "X-CSRFToken": getCRSFToken(),
            ...extraHeaders
        } ),
        body: data
    } ).then( ( response ) => {
        if ( type === 'json' ) {
            return response.json()
        } else if ( type === 'xml' ) {
            return response.text()
        }
    } )
}
export const getPropertyFromConfig = ( config, property, defaultValue ) => {
    const propertyValue = config && typeof ( config[ property ] ) !==
        "undefined" ? config[ property ] : defaultValue
    const nestedPropertyValue = config && config.config && typeof ( config
        .config[ property ] ) !== "undefined" ? config.config[
        property ] : propertyValue
    return nestedPropertyValue
}
export const checkURL = ( value ) => {
    /* validator validate strings only */
    if ( typeof ( value ) === "string" ) {
        return isURL( value )
    }
    return false
}
export const checkImageSrc = ( src, good, bad ) => {
    let img = new Image()
    img.onload = good
    img.onerror = bad
    img.src = src
}
export const getSelectOptions = ( arr, label = null, value = null ) => {
    let options = []
    if ( arr && arr.length > 0 ) {
        options = arr.map( item => {
            if ( !label ) {
                return { value: item, label: item }
            }
            return {
                value: item[ label ],
                label: item[ value ? value : label ]
            }
        } )
    }
    return options
}
