import 'Source/css/popup.css'

import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import ArrowRight from 'material-ui-icons/KeyboardArrowRight'
import Button from 'material-ui/Button'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import ZoomIcon from 'material-ui-icons/ZoomIn'
import classnames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        height: 'auto'
    },
    titlePanel: {
        backgroundColor: theme.palette.primary[500],
        borderColor: '#777777',
    },
    content: {
        backgroundColor: theme.palette.background.paper
    }
})
const FeatureAttributesTable = (props) => {
    const { currentFeature } = props
    return (
        <ul>
            {Object.keys(currentFeature.getProperties()).map((key, index) => {
                if (key != "geometry" && key !== "_layerTitle") {
                    return (
                        <div key={index}>
                            <li>
                                {`${key}`}
                            </li>
                            <li>
                                {`${currentFeature.getProperties()[key]}`}
                            </li>
                        </div>
                    )
                }
            })}
        </ul>
    )
}
FeatureAttributesTable.propTypes = {
    currentFeature: PropTypes.object.isRequired
}
class CartoviewPopup extends React.Component {
    state = {
        currentFeature: null
    }
    ensureEvents = () => {
        const {
            resetFeatureCollection,
            changeShowPopup,
            nextFeature,
            previousFeature,
            zoomToFeature
        } = this.props
        let self = this
        var closer = self.popupCloser
        var nextB = self.nextButton
        var prevB = self.prevButton
        var zoomToB = self.zoomToButton
        if (closer.onclick === null) {
            closer.onclick = () => {
                resetFeatureCollection()
                changeShowPopup()
                return false
            }
        }
        if (nextB.onclick === null) {
            nextB.onclick = () => {
                nextFeature()
            }
        }
        if (prevB.onclick === null) {
            prevB.onclick = () => {
                previousFeature()
            }
        }
        if (zoomToB.onclick === null) {
            zoomToB.onclick = () => {
                let { currentFeature } = this.state
                zoomToFeature(currentFeature)
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const { addOverlay } = this.props
        const { featureIdentifyResult, activeFeature } = nextProps
        if (nextProps.showPopup) {
            this.node.style.display = 'block'
            addOverlay(this.node)
            let currentFeature = featureIdentifyResult.length > 0 ?
                featureIdentifyResult[activeFeature] : null
            this.setState({ currentFeature })
            this.ensureEvents()
        } else {
            this.node.style.display = 'none'
        }
    }
    render() {
        let {
            featureIdentifyResult,
            featureIdentifyLoading,
            activeFeature,
            classes
        } = this.props
        const nextButtonVisible = (featureIdentifyResult.length > 0 &&
            activeFeature != featureIdentifyResult.length - 1)
        const currentFeature = featureIdentifyResult[activeFeature]
        return (
            <div ref={node => this.node = node} id="popup" className="ol-popup-cartoview">
                <Paper elevation={2}>
                    <div className={classnames("title-panel", { [classes.titlePanel]: true })}>
                        {featureIdentifyResult.length != 0 && <Typography type="body1" align="left" noWrap={true} color="default" className="element-flex title-text">{`Layer : ${currentFeature.get('_layerTitle')}`}</Typography>}
                        <IconButton color="default" className={classnames({ 'hidden': activeFeature === 0, 'visible': activeFeature != 0, 'popup-buttons': true, [classes.button]: true })} buttonRef={(node) => this.prevButton = node} aria-label="Delete">
                            <ArrowLeft />
                        </IconButton>
                        <IconButton color="default" className={classnames({ 'hidden': !nextButtonVisible, 'visible': nextButtonVisible, 'popup-buttons': true, [classes.button]: true })} buttonRef={(node) => this.nextButton = node} aria-label="Delete">
                            <ArrowRight />
                        </IconButton>
                        <IconButton color="default" buttonRef={(node) => this.popupCloser = node} className={classes.button} aria-label="Delete">
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className={classnames("cartoview-popup-content", { [classes.content]: true })}>{featureIdentifyResult.length > 0 && <div>
                        <FeatureAttributesTable currentFeature={currentFeature} />
                    </div>}
                        {featureIdentifyResult.length == 0 && !featureIdentifyLoading && <h5>{"No Features at this Point"}</h5>}
                    </div>
                    <div className="cartoview-popup-actions center">
                        <div ref={(input) => { this.zoomToButton = input }} >
                            {(featureIdentifyResult.length != 0 && !featureIdentifyLoading) && <Button color="default" className={classes.button} dense>
                                <ZoomIcon />
                                <Typography type="caption" align="left" noWrap={false} color="inherit">{`Zoom To Feature`}</Typography>
                            </Button>}
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}
CartoviewPopup.propTypes = {
    resetFeatureCollection: PropTypes.func.isRequired,
    zoomToFeature: PropTypes.func.isRequired,
    addOverlay: PropTypes.func.isRequired,
    changeShowPopup: PropTypes.func.isRequired,
    addStyleToFeature: PropTypes.func.isRequired,
    nextFeature: PropTypes.func.isRequired,
    previousFeature: PropTypes.func.isRequired,
    featureIdentifyResult: PropTypes.array.isRequired,
    featureIdentifyLoading: PropTypes.bool.isRequired,
    showPopup: PropTypes.bool.isRequired,
    activeFeature: PropTypes.number.isRequired,
    map: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(CartoviewPopup)
