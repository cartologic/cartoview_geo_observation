import ExpansionPanel, {
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
// import Hidden from 'material-ui/Hidden'
// import List from 'material-ui/List'
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import { doGet, doPost } from 'Source/utils/utils'

import { CircularProgress } from 'material-ui/Progress'
import CommentsList from './CommentsList';
import Divider from 'material-ui/Divider'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import FeatureListHelper from 'Source/helpers/FeatureListHelper'
import IconButton from 'material-ui/IconButton';
import ImageDialog from './ImageUploadDialog'
import LayersHelper from 'Source/helpers/LayersHelper'
import Lightbox from 'react-images';
import MapConfigService from 'Source/services/MapConfigService'
import MapConfigTransformService from 'Source/services/MapConfigTransformService'
import MapViewer from 'Source/components/view/feature_list/MapViewer'
import OpenWithIcon from 'material-ui-icons/OpenWith'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import URLS from 'Source/containers/URLS'
import classNames from 'classnames'
import { getCRSFToken } from 'Source/helpers/helpers.jsx'
import { lighten } from 'material-ui/styles/colorManipulator'
import { withStyles } from 'material-ui/styles'
import { wmsGetFeatureInfoFormats } from 'Source/helpers/FeaturesHelper'

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 'fit-content !important',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: 'space-around',
        },

    },
    rootLoading: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    avatar: {
        color: '#fff',
        backgroundColor: theme.palette.secondary.light
    },
    gridList: {
        width: "100%",
        height: 450,
    },
    tabelPaper: {
        width: '48%',
        height: 'fit-content !important',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    paperText: {
        padding: theme.spacing.unit * 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        flexDirection: "row",
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            padding: theme.spacing.unit
        },
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    header: {
        color: theme.palette.secondary.contrastText,
        padding: theme.spacing.unit * 2,
        backgroundColor: lighten(theme.palette.secondary.light, 0.4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing.unit
        },
    },
    panelDetails: {
        justifyContent: "space-around",
        flexDirection: "column"
    },
    tileImage: {
        width: '100%'
    }
})
class FeatureDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            feature: null,
            loading: true,
            files: [],
            comments: [],
            map: FeatureListHelper.getMap('details-map'),
            lightboxOpened: false,
            currentImage: 0
        }
        this.urls = new URLS(this.props.urls)
    }
    readThenSave = (file, featureId) => {
        const { config, username } = this.props
        const { files } = this.state
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const apiData = {
                file: reader.result,
                file_name: `${featureId}.png`,
                username: username,
                is_image: true,
                feature_id: featureId,
                tags: FeatureListHelper.getAttachmentTags(config)
            }
            this.saveAttachment(apiData).then(result => {
                this.setState({
                    files: [...
                        files, result]
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
    handleLightBoxImage = (index) => {
        this.setState({ currentImage: index })
        this.handleLightBox()
    }
    mapInit = () => {
        const { urls } = this.props
        let { map } = this.state
        doGet(urls.mapJsonUrl).then((config) => {
            MapConfigService.load(MapConfigTransformService.transform(
                config), map, urls.proxy)
        })
    }
    componentWillMount() {
        const { urls, match } = this.props
        this.mapInit()
        let layer = match.params.typename
        layer= LayersHelper.layerName(layer)
        const query = { 'feature_id': match.params.fid }
        const filesURL = this.urls.getParamterizedURL(urls.attachmentUploadUrl(layer), query)
        const commentsURL = this.urls.getParamterizedURL(urls.commentsUploadUrl(layer), query)
        let filesPromise = FeatureListHelper.loadAttachments(filesURL)
        let commentsPromise = FeatureListHelper.loadAttachments(commentsURL)
        Promise.all([filesPromise, commentsPromise, this.getFeature()]).then(([files, comments, features]) => {
            let transformedFeatures = wmsGetFeatureInfoFormats['application/json'].readFeatures(features)
            this.setState({ feature: transformedFeatures[0], files, comments, loading: false })
        })
    }
    addComment = (data) => {
        const { urls, username,match } = this.props
        const apiData = { ...data, username }
        const { comments } = this.state
        let layer = match.params.typename
        layer= LayersHelper.layerName(layer)
        const url = urls.commentsUploadUrl(layer)
        doPost(url, JSON.stringify(apiData), {
            "Content-Type": "application/json; charset=UTF-8"
        }).then(result => {
            this.setState({ comments: [...comments, result] })
        })
    }
    getFeature = () => {
        const { match, urls, config } = this.props
        let { map } = this.state
        const fid = match.params.fid
        let layer = match.params.typename
        const requestUrl = FeatureListHelper.getFeaturesURL(urls.wfsURL,
            0, layer, fid, parseInt(config.pagination), map.getView().getProjection().getCode())
        return doGet(requestUrl)
    }
    getImages = () => {
        const { files } = this.state
        let images = []
        files.forEach(file => {
            if (file.is_image) {
                images.push({ src: file.file, title: file.file_name, username: file.username })
            }
        })
        return images
    }
    saveAttachment = (data) => {
        const { urls,match } = this.props
        let layer = match.params.typename
        const url = urls.attachmentUploadUrl(LayersHelper.layerName(
            layer))
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
    handleLightBoxPrev = () => {
        const { currentImage } = this.state
        if (currentImage > 0) {
            this.setState({ currentImage: currentImage - 1 })
        }
    }
    handleLightBoxNext = () => {
        const { currentImage } = this.state
        const images = this.getImages()
        if (currentImage < images.length) {
            this.setState({ currentImage: currentImage + 1 })
        }
    }
    handleLightBox = () => {
        const { lightboxOpened } = this.state
        this.setState({ lightboxOpened: !lightboxOpened })
    }
    render() {
        const { classes, config, username, urls } = this.props
        let { feature, loading, comments, map, currentImage } = this.state
        let images = this.getImages()
        return (
            <div className={classNames({ [classes.root]: !loading, [classes.rootLoading]: loading })}>
                {!loading && feature && <Paper className={classes.tabelPaper} elevation={0}>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary classes={{ content: "text-wrap" }} expandIcon={<ExpandMoreIcon />}>
                            <Typography className="text-wrap" variant="title" noWrap>{`Attributes`}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: classes.panelDetails }}>
                            {Object.keys(feature.getProperties()).map((key, index) => {
                                if (key != "geometry" && key !== "_layerTitle") {
                                    return <div key={index}>
                                    <div className={classNames([classes.paperText], 'text-wrap')} >
                                        <Typography className="text-wrap" noWrap variant="body2">{`${key}`}</Typography>
                                        <Typography className="text-wrap" noWrap variant="caption">{`${feature.getProperties()[key] || "No Value"}`}</Typography>
                                    </div>
                                    <Divider />
                                </div>
                                } 
                            }
                            )}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary classes={{ content: "text-wrap" }} expandIcon={<ExpandMoreIcon />}>
                            <Typography className="text-wrap" variant="subheading" noWrap>{`Comments`}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: classes.panelDetails }}>
                            {!loading && <CommentsList addComment={this.addComment} comments={comments} username={username} urls={urls} commentsIsLoading={loading} selectedFeature={feature} />}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary classes={{ content: "text-wrap" }} expandIcon={<ExpandMoreIcon />}>
                            <Typography className="text-wrap" variant="subheading" noWrap>{`files`}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: classes.panelDetails }}>
                            {images.length > 0 && <GridList cellHeight={160} className={classes.gridList} cols={3}>
                                {images.map((image, index) => (
                                    <GridListTile classes={{ tile: classes.tileImage }} key={image.src} cols={image.cols || 1}>
                                        <img src={image.src} alt={image.title} />
                                        <GridListTileBar
                                            title={image.title}
                                            subtitle={<span>by: {image.username}</span>}
                                            actionIcon={
                                                <IconButton onClick={() => this.handleLightBoxImage(index)} className={classes.icon}>
                                                    <OpenWithIcon />
                                                </IconButton>
                                            }
                                        />
                                    </GridListTile>
                                ))}
                            </GridList>}
                            {images.length > 0 && <Lightbox
                                images={images}
                                currentImage={currentImage}
                                onClickPrev={this.handleLightBoxPrev}
                                onClickNext={this.handleLightBoxNext}
                                isOpen={this.state.lightboxOpened}
                                onClose={this.handleLightBox}
                            />}
                            {images.length == 0 && <Typography className="text-wrap" variant="subheading" noWrap>{`No Images Available`}</Typography>}
                            {!loading && feature && <ImageDialog getImageFromURL={this.getImageFromURL} username={username} SaveImageBase64={this.SaveImageBase64} featureId={feature.getId()} />}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Paper>}
                {!loading && feature && <MapViewer map={map} urls={urls} feature={feature} />}
                {loading && !feature && <CircularProgress className={classes.progress} thickness={7} />}
            </div>
        )
    }
}
FeatureDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    username: PropTypes.string,
    urls: PropTypes.object.isRequired
}
export default withStyles(styles)(FeatureDetails)