import Animation from 'Source/helpers/AnimationHelper'
import Collection from 'ol/collection'
import FeatureListHelper from 'Source/helpers/FeatureListHelper'
import GeoJSON from 'ol/format/geojson'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Vector from 'ol/layer/vector'
import { default as VectorSource } from 'ol/source/vector'
import compose from 'recompose/compose'
import { styleFunction } from 'Source/helpers/StyleHelper'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
    root: {
        width: '48%',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
        },
        height: 400
    },
    map: {
        width: '100%',
        height: '100%'

    }
})
class MapViewer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            featureCollection: new Collection(),
        }
    }
    zoomToFeature = (feature) => {
        const { map } = this.props
        this.addStyleToFeature([feature])
        const featureCenter = feature.getGeometry().getExtent()
        const center = FeatureListHelper.getCenterOfExtent(featureCenter)
        Animation.flyTo(center, map.getView(), 14, () => { })
    }
    componentDidMount() {
        const { map, feature } = this.props
        map.setTarget(this.mapDiv)
        this.addSelectionLayer()
        map.once('postrender', (event) => {
            this.zoomToFeature(feature)
        })

    }
    addStyleToFeature = (features) => {
        let { featureCollection } = this.state
        this.resetFeatureCollection()
        if (features && features.length > 0) {
            featureCollection.extend(features)
        }
    }
    resetFeatureCollection = () => {
        let { featureCollection } = this.state
        featureCollection.clear()
    }
    addSelectionLayer = () => {
        let { featureCollection } = this.state
        const { map } = this.props
        let source = new VectorSource({ features: featureCollection })
        new Vector({
            source: source,
            style: styleFunction,
            title: "Selected Features",
            zIndex: 10000,
            format: new GeoJSON({
                defaultDataProjection: map.getView().getProjection(),
                featureProjection: map.getView().getProjection()
            }),
            map: map
        })
        source.on('addfeature', (e) => {
            Animation.flash(e.feature, map)
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { width } = this.props
        if (prevProps.width !== width) {
            this.props.map.updateSize()
        }
    }
    render() {
        const { classes } = this.props
        return (
            <Paper className={classes.root} elevation={4}>
                <div id="details-map" ref={(node) => this.mapDiv = node} className={classes.map}></div>
            </Paper>
        )
    }
}
MapViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
    feature: PropTypes.object.isRequired,
    width: PropTypes.string,
    map: PropTypes.object.isRequired
}
export default compose(withStyles(styles), withWidth())(MapViewer);
