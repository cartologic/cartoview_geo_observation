import FeaturesHelper, { wmsGetFeatureInfoFormats } from 'Source/helpers/FeaturesHelper'
import React, { Component } from 'react'
import { doGet, doPost } from 'Source/utils/utils'

import FeatureList from 'Source/components/view/feature_list/FeatureList'
import FeatureListHelper from 'Source/helpers/FeatureListHelper'
import GeoCollectHelper from 'Source/helpers/GeoCollectHelper'
import LayersHelper from 'Source/helpers/LayersHelper'
import PropTypes from 'prop-types'
import URLS from './URLS'
import { getCRSFToken } from '../helpers/helpers.jsx'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
    container: {
        height: 'calc(100% - 96px)'
    },
    scrolling: {
        overflowY: 'overlay'
    }
});
class FeatureListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            featuresIsLoading: true,
            totalFeatures: 0,
            features: [],
            attachmentIsLoading: false,
            commentsIsLoading: true,
            attachments: [],
            comments: [],
            targetNameSpace: null,
            geometryName: null,
            geometryType: null
        }
        this.urls = new URLS(this.props.urls)
    }
    buildDescribeFeatureTypeURL = (typeName) => {
        const { urls } = this.props
        const url = this.urls.wfsQueryBuilder(urls.wfsURL, {
            version: '1.3.0',
            request: "describeFeatureType",
            outputFormat: "application/json",
            service: "WFS",
            typeName
        })
        return url
    }
    getGeometryName = () => {
        const { config } = this.props
        const url = this.buildDescribeFeatureTypeURL(config.layer)
        doGet(url).then(result => {
            result.featureTypes[0].properties.forEach(attribute => {
                if (attribute.type.includes("gml:")) {
                    let data = {
                        targetNameSpace: result.targetNamespace,
                        geometryName: attribute.name,
                        geometryType: attribute.type.split(":").pop()
                    }
                    this.setState({ ...data })
                }
            })
        })
    }
    deleteFeature = (feature, index) => {
        const { config, urls } = this.props
        const { targetNameSpace } = this.state
        this.setState({ featuresIsLoading: true })
        //TODO: fix name space
        const xml = GeoCollectHelper.wfsTransaction(feature, config.layer, targetNameSpace || "http://www.geonode.org/", undefined, "delete")
        doPost(urls.wfsURL, xml, {
            'Content-Type': 'text/xml',
        }, 'xml').then((res) => {
            let features = this.state.features
            const { totalFeatures } = this.state
            features.splice(index, 1)
            this.setState({ featuresIsLoading: false, features, totalFeatures: totalFeatures - 1 })
        })
        //TODO: Delete Feature Attachments
    }
    readThenSave = (file, featureId) => {
        const { config } = this.props
        const { attachments } = this.state
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const apiData = {
                file: reader.result,
                file_name: `${featureId}.png`,
                username: config.username,
                is_image: true,
                feature_id: featureId,
                tags: FeatureListHelper.getAttachmentTags(config)
            }
            this.saveAttachment(apiData).then(result => {
                this.setState({
                    attachments: [...
                        attachments, result]
                })
            })
        }
        reader.onerror = (error) => {
            throw (error)
        }
    }
    SaveImageBase64 = (file, featureId) => {
        this.readThenSave(file, featureId)
    }
    getImageFromURL = (url, featureId) => {
        const proxiedURL = this.urls.getProxiedURL(url)
        FeatureListHelper.checkImageSrc(proxiedURL, () => {
            fetch(proxiedURL, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "image/*"
                }
            }).then(response => response.blob()).then(blob => {
                this.readThenSave(blob, featureId)
            })
        }, () => alert("bad Image"))
    }
    addComment = (data) => {
        const { urls, config } = this.props
        const apiData = { ...data, username: config.username }
        const { comments } = this.state
        const url = urls.commentsUploadUrl(LayersHelper.layerName(config
            .layer))
        return fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            }),
            body: JSON.stringify(apiData)
        }).then((response) => response.json()).then(result => {
            this.setState({ comments: [...comments, result] })
        })
    }
    getFilterType = () => {
        const { urls, config } = this.props
        fetch(`${urls.layerAttributes}?layer__typename=${config.layer}`, {
            method: "GET",
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            const filterType = FeatureListHelper.getFilterByName(
                data.objects, config.filters).split(":").pop()
            this.setState({ filterType })
        }).catch((error) => {
            throw Error(error)
        })
    }
    componentWillMount() {
        const { config } = this.props
        this.getGeometryName()
        if (config.filters) {
            this.getFilterType()
        }
        this.getFeatures(0)
        this.getCommentsAndFiles().then(([attachments, comments]) => {
            this.setState({ attachments, comments }, this.setAttachmentCommentsLoading(
                false))
        })
    }
    setAttachmentCommentsLoading = (loading) => {
        this.setState({ attachmentIsLoading: loading, commentsIsLoading: loading })
    }
    searchFilesById = (id) => {
        const { attachments } = this.state
        let result = []
        if (attachments) {
            attachments.map((imageObj) => {
                if (imageObj.is_image && imageObj.feature_id === id) {
                    result.push(imageObj)
                }
            })
        }
        return result
    }
    searchCommentById = (id) => {
        const { comments } = this.state
        let result = []
        if (comments) {
            comments.map((comment) => {
                if (comment.feature_id === id) {
                    result.push(comment)
                }
            })
        }
        return result
    }
    getFeatures = (startIndex) => {
        let { totalFeatures } = this.state
        const { urls, config } = this.props
        const requestUrl = FeatureListHelper.getFeaturesURL(urls.wfsURL, startIndex, config.layer, null, parseInt(config.pagination))
        fetch(this.urls.getProxiedURL(requestUrl)).then((response) =>
            response.json()).then(
                (data) => {
                    let features = wmsGetFeatureInfoFormats[
                        'application/json'].readFeatures(data)
                    let newData = { features, featuresIsLoading: false }
                    const total = data.totalFeatures
                    if (totalFeatures === 0) {
                        newData['totalFeatures'] = total
                    }
                    this.setState(newData)
                })
    }
    loadAttachments = (attachmentURL) => {
        return fetch(attachmentURL).then((response) => response.json())
    }
    getCommentsAndFiles = () => {
        const { config, urls } = this.props
        const typename = LayersHelper.layerName(config.layer)
        const filesURL = urls.attachmentUploadUrl(typename)
        const commentsURL = urls.commentsUploadUrl(typename)
        return Promise.all([this.loadAttachments(filesURL), this.loadAttachments(
            commentsURL)])
    }
    saveAttachment = (data) => {
        const { urls, config } = this.props
        const url = urls.attachmentUploadUrl(LayersHelper.layerName(
            config.layer))
        return fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            }),
            body: JSON.stringify(data)
        }).then((response) => response.json())
    }
    addStyleToFeature = (features) => {
        this.state.featureCollection.clear()
        if (features && features.length > 0) {
            this.state.featureCollection.extend(features)
        }
    }
    featureIdentify = (map, coordinate) => {
        const { config } = this.props
        const view = map.getView()
        const selectedLayer = LayersHelper.getWMSLayer(config.layer, map.getLayers()
            .getArray())
        let identifyPromises = [selectedLayer].map(
            (layer) => FeaturesHelper.readFeaturesThenTransform(
                this.urls, layer, coordinate, view, map))
        Promise.all(identifyPromises).then(result => {
            const featureIdentifyResult = result.reduce((array1,
                array2) => array1.concat(array2), [])
            this.setState({
                featureIdentifyLoading: false,
                featureIdentifyResult,
                activeFeature: null,
                detailsModeEnabled: false,
                detailsOfFeature: null,
            }, () => this.addStyleToFeature(
                featureIdentifyResult))
        })
    }
    render() {
        const { config, urls, location, match, classes } = this.props
        let childrenProps = {
            config,
            ...this.state,
            getFeatures: this.getFeatures,
            searchFilesById: this.searchFilesById,
            zoomToFeature: this.zoomToFeature,
            search: this.search,
            addComment: this.addComment,
            searchCommentById: this.searchCommentById,
            urls,
            deleteFeature: this.deleteFeature,
            SaveImageBase64: this.SaveImageBase64,
            getImageFromURL: this.getImageFromURL,

        }
        return (<FeatureList childrenProps={childrenProps} match={match} location={location} />)
    }
}
FeatureListContainer.propTypes = {
    classes: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}
export default withStyles(styles)(FeatureListContainer)