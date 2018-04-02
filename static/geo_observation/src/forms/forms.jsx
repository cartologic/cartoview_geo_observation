import t from 'tcomb-form'
export const detailsConfigFormSchema = () => {
    const selectTagItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        attachmentTags: t.maybe(t.list(selectTagItem)),
        attributesToDisplay: t.maybe(t.list(selectTagItem))

    })
    return formSchema
}
export const generalFormSchema = () => {
    const selectKeywordItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        title: t.String,
        abstract: t.maybe(t.String),
        keywords: t.list(selectKeywordItem)
    })
    return formSchema
}
export const accessFormSchema = () => {
    const selectUserItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        whoCanView: t.maybe(t.list(selectUserItem)),
        whoCanChangeMetadata: t.maybe(t.list(selectUserItem)),
        whoCanDelete: t.maybe(t.list(selectUserItem)),
        whoCanChangeConfiguration: t.maybe(t.list(selectUserItem))
    })
    return formSchema
}
export const layerSelectFormSchema = () => {
    const formSchema = t.struct({
        layer: t.String,
    })
    return formSchema
}
export const toolFormSchema = () => {
    const formSchema = t.struct({
        showZoombar: t.Boolean,
        showLayerSwitcher: t.Boolean,
        showBaseMapSwitcher: t.Boolean,
        showLegend: t.Boolean,
        showMap: t.Boolean,
    })
    return formSchema
}
export const featureDetailsFormSchema = () => {
    const selectTagItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        attachmentTags: t.maybe(t.list(selectTagItem)),
        attributesToDisplay: t.maybe(t.list(selectTagItem)),
        showNumberOfComments: t.Boolean,
        showNumberOfViews: t.Boolean,
        showFeatureOwner: t.Boolean,
        showStarRating: t.Boolean,
    })
    return formSchema
}
export const listConfigFormSchema = () => {
    const formSchema = t.struct({
        titleAttribute: t.String,
        subtitleAttribute: t.maybe(t.String),
        filters: t.maybe(t.String),
        pagination: t.String,
        zoomOnSelect: t.Boolean,
        enableImageListView: t.Boolean,
        showList: t.Boolean,

    })
    return formSchema
}