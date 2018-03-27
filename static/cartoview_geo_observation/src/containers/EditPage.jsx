import 'Source/css/app.css'
import 'react-select/dist/react-select.css'

import { doGet, doPost } from 'Source/utils/utils'

import AppAccess from 'Source/components/edit/Access'
import AppConfiguration from 'Source/components/edit/AppConfiguration'
import EditPageComponent from 'Source/components/edit/EditPage'
import FeatureDetailsPanel from 'Source/components/edit/FeatureDetailsPanel'
import FeatureListConfig from 'Source/components/edit/FeatureListConfig'
import FormFields from 'Source/components/edit/FormFields'
import LayerSelector from 'Source/components/edit/LayerSelector'
import MapSelector from 'Source/components/edit/MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import ToolConfiguration from 'Source/components/edit/ToolConfiguration'
import URLS from 'Source/containers/URLS'
import { getPropertyFromConfig } from 'Source/utils/utils'

const limit = 9
class EditPage extends React.Component {
    constructor(props) {
        super(props)
        this.urls = new URLS(this.props.urls)
        const { config } = this.props
        this.state = {
            maps: [],
            userMaps: true,
            selectedMap: getPropertyFromConfig(config, 'map', null),
            selectedLayer: getPropertyFromConfig(config, 'layer', null),
            loading: false,
            mapLayers: [],
            totalMaps: 0,
            layerAttributes: [],
            title: getPropertyFromConfig(config, 'title', null),
            abstract: getPropertyFromConfig(config, 'abstract', null),
            config: getPropertyFromConfig(config, 'config', null),
            tags: [],
            keywords: [],
            featureTypes: null,
            saving: false,
            errors: [],
            profiles: [],
            instanceId: getPropertyFromConfig(config, 'id', null),
            searchEnabled: false
        }
    }
    getLayerAttributes = (typename) => {
        const { config, urls } = this.props
        this.setState({ loading: true })
        const url = this.urls.getParamterizedURL(urls.wfsURL, {
            'service': 'wfs', 'version': '2.0.0',
            'request': 'DescribeFeatureType',
            'typeName': typename, 'outputFormat': 'application/json'
        })
        doGet(url).then(
            (data) => {
                this.setState({ layerAttributes: data.featureTypes[0].properties })
                this.setState({ loading: false })
            }).catch((error) => {
                throw error
            })

    }
    componentWillMount() {
        const { selectedMap, config, selectedLayer } = this.state
        this.getMaps()
        if (selectedMap) {
            this.getMapLayers()
        }
        if (selectedLayer) {
            this.getFeatureTypes(selectedLayer)
        }
        this.getKeywords().then(result => {
            this.setState({ keywords: result.objects })
        })
        this.getProfiles().then(result => {
            this.setState({ profiles: result.objects })
        })
        this.getTags()
    }
    UserMapsChanged = () => {
        const { userMaps } = this.state
        this.setState({ userMaps: !userMaps }, this.getMaps)
    }
    getMapLayers() {
        const { urls } = this.props
        const { selectedMap } = this.state
        const url = this.urls.getParamterizedURL(urls.mapLayers, { map__id: selectedMap.id, "type": "point" })
        this.setState({ loading: true })
        doGet(url).then((data) => {
            let pointLayers = data.objects.filter((layer) => {
                return layer.layer_type.toLowerCase().includes(
                    "point")
            })
            this.setState({ mapLayers: pointLayers, loading: false })
        }).catch((error) => {
            console.error(error)
        })
    }
    getMaps = (offset = 0, limit = limit) => {
        this.setState({ loading: true })
        const { username } = this.props
        const { userMaps } = this.state
        const url = this.urls.getMapApiURL(username, userMaps, limit,
            offset)
        doGet(url).then(result => {
            this.setState({
                maps: result.objects,
                loading: false,
                totalMaps: result.meta.total_count
            })
        })
    }
    searchMapById = (id) => {
        const { maps } = this.state
        let result = null
        for (let map of maps) {
            if (map.id === id) {
                result = map
                break
            }
        }
        return result
    }
    handleSearchMode = (bool) => {
        this.setState({ searchEnabled: bool })
    }
    search = (text) => {
        this.setState({ loading: true, searchEnabled: true })
        const { username } = this.props
        const { userMaps } = this.state
        const url = this.urls.getMapApiSearchURL(username, userMaps, text)
        doGet(url).then(result => {
            this.setState({
                maps: result.objects,
                loading: false
            })
        })
    }
    getAttributes = (typename) => {
        this.setState({ loading: true })
        const { urls } = this.props
        if (typename) {
            let url = urls.layerAttributes
            url = this.urls.getParamterizedURL(url, { 'layer__typename': typename })
            doGet(url).then(result => {
                this.setState({
                    layerAttributes: result.objects,
                    loading: false
                })
            })
        }
    }
    getKeywords = (input = null) => {
        const { urls } = this.props
        const url = !input ? urls.keywordsAPI : this.urls.getParamterizedURL(urls.keywordsAPI, { slug__icontains: input })
        return doGet(url)
    }
    getProfiles = (input = null) => {
        const { urls } = this.props
        const url = !input ? urls.profilesAPI : this.urls.getParamterizedURL(urls.profilesAPI, { username__icontains: input })
        return doGet(url)
    }
    getTags = () => {
        const { urls } = this.props
        doGet(urls.tagsAPI).then(result => {
            this.setState({ tags: result })
        })
    }
    selectMap = (map) => {
        this.setState({ selectedMap: map }, this.getMapLayers)
    }
    setStepRef = (name, ref) => {
        this[name] = ref
    }
    doDescribeFeatureType = (typename) => {
        let { urls } = this.props
        const url = urls.describeFeatureType(typename)
        const proxiedURL = this.urls.getProxiedURL(url)
        return doGet(proxiedURL)
    }
    getFeatureTypes = (typename) => {
        const { doDescribeFeatureType, config } = this.props
        this.setState({ loading: true })
        this.doDescribeFeatureType(typename).then(result => {
            this.setState({
                featureTypes: result.featureTypes[0].properties,
                loading: false
            }, this.getLayerAttributes(typename))
        })
    }
    getSteps = () => {
        const {
            maps,
            loading,
            selectedMap,
            userMaps,
            totalMaps,
            config,
            title,
            abstract,
            keywords,
            mapLayers,
            instanceId,
            searchEnabled,
            layerAttributes,
            tags,
            featureTypes,
            profiles
        } = this.state
        let steps = [
            {
                title: "Select Map",
                component: MapSelector,
                ref: 'mapStep',
                hasErrors: false,
                props: {
                    maps,
                    selectedMap,
                    loading,
                    selectMap: this.selectMap,
                    getMaps: this.getMaps,
                    userMaps,
                    totalMaps,
                    UserMapsChanged: this.UserMapsChanged,
                    limit,
                    search: this.search,
                    handleSearchMode: this.handleSearchMode,
                    searchEnabled
                }
            },
            {
                title: "Layer",
                component: LayerSelector,
                ref: 'layerSelectStep',
                hasErrors: false,
                props: {
                    config,
                    mapLayers,
                    loading,
                    getFeatureTypes: this.getFeatureTypes
                }
            },
            {
                title: "Form Builder",
                component: FormFields,
                ref: 'buildFormStep',
                hasErrors: false,
                props: {
                    config,
                    layerAttributes,
                    loading,
                    featureTypes,
                    config,
                }
            },
            {
                title: "Feature List",
                component: FeatureListConfig,
                ref: 'featureListStep',
                hasErrors: false,
                props: {
                    config,
                    layerAttributes,
                    loading,
                    config,
                }
            },
            {
                title: "Feature Details Panel ",
                component: FeatureDetailsPanel,
                ref: 'featureDetailStep',
                hasErrors: false,
                props: {
                    config,
                    layerAttributes,
                    loading,
                    config,
                    tags,
                }
            },
            {
                title: "General",
                component: AppConfiguration,
                ref: 'generalStep',
                hasErrors: false,
                props: {
                    abstract,
                    title,
                    selectedMap,
                    config,
                    getKeywords: this.getKeywords,
                    allKeywords: keywords,
                    instanceId
                }
            },
            {
                title: "Acccess",
                component: AppAccess,
                ref: 'accessConfigurationStep',
                hasErrors: false,
                props: {
                    loading,
                    config,
                    profiles,
                    getProfiles: this.getProfiles
                }
            },
            {
                title: "Map Tools",
                component: ToolConfiguration,
                ref: 'toolsStep',
                hasErrors: false,
                props: {
                    config,
                    instanceId
                }
            }
        ]
        const { errors } = this.state
        errors.map(error => steps[error].hasError = true)
        return steps
    }
    toArray = (arrayOfStructs) => {
        let arr = []
        if (arrayOfStructs) {
            arrayOfStructs.forEach((struct) => {
                arr.push(struct.value)
            }, this)
        }
        return arr
    }
    prepareServerData = () => {
        const keywords = this.generalStep.getComponentValue().keywords
        let featureDetailValue = { ...this.featureDetailStep.getComponentValue() }
        let attributes = featureDetailValue.attributesToDisplay
        let tags = featureDetailValue.attachmentTags
        featureDetailValue.attachmentTags = this.toArray(tags)
        featureDetailValue.attributesToDisplay = this.toArray(attributes)
        const { selectedMap } = this.state
        let finalConfiguration = {
            map: selectedMap.id,
            ...this.generalStep.getComponentValue(),
            config: {
                ...this.toolsStep.getComponentValue(),
                ...this.layerSelectStep.getComponentValue(),
                ...this.buildFormStep.getComponentValue(),
                ...this.featureListStep.getComponentValue(),
                ...featureDetailValue,
                components:{
                    featureList:this.featureListStep.getComponentValue().hideComponent,
                    basicViewer:this.toolsStep.getComponentValue().hideComponent
                }
            },
            access: this.accessConfigurationStep.getComponentValue(),
            keywords: this.toArray(keywords)
        }


        return finalConfiguration

    }
    sendConfiguration = () => {
        const { urls } = this.props
        const { instanceId, errors } = this.state
        if (errors.length == 0) {
            this.setState({ saving: true })
            const url = instanceId ? urls.editURL(instanceId) : urls.newURL
            const data = JSON.stringify(this.prepareServerData())
            doPost(url, data, { "Content-Type": "application/json; charset=UTF-8" }).then(result => {
                this.setState({
                    instanceId: result.id,
                    saving: false
                })
            })

        }

    }
    showComponentsErrors = (callBack) => {
        let errors = []
        const steps = this.getSteps()
        steps.map((step, index) => {
            const formValue = this[step.ref].getComponentValue()
            if (!formValue) {
                errors.push(index)
            }
        })
        this.setState({ errors }, callBack)
    }
    save = () => {
        this.showComponentsErrors(this.sendConfiguration)

    }
    validate = () => {
        this.showComponentsErrors(() => { })
    }
    getChildrenProps = () => {
        const props = {
            ...this.state,
            ...this.props,
            steps: this.getSteps(),
            setStepRef: this.setStepRef,
            save: this.save,
            validate: this.validate
        }
        return props
    }
    render() {
        return (
            <div>
                <EditPageComponent childrenProps={this.getChildrenProps()} />
            </div>
        )
    }
}
EditPage.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object,
    username: PropTypes.string.isRequired
}
export default EditPage
