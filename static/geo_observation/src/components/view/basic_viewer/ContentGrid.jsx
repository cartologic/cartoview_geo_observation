import React, { Component } from 'react'

import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import ArrowRight from 'material-ui-icons/KeyboardArrowRight'
import CartoviewDrawer from 'Source/components/view/basic_viewer/Drawer'
import CartoviewPopup from 'Source/components/view/basic_viewer/popup'
import Fade from 'material-ui/transitions/Fade'
import GeoCode from 'Source/components/view/basic_viewer/GeoCode'
import Grid from 'material-ui/Grid'
import IconButton from 'material-ui/IconButton'
import { Loader } from 'Source/components/view/feature_list/statelessComponents'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import Slide from 'material-ui/transitions/Slide'
import Snackbar from 'material-ui/Snackbar'
import classnames from "classnames"
import compose from 'recompose/compose'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
    root: {
        height: "100%"
    },
    drawer: {
        width: "30%",
        height: "100%",
        zIndex: "1150",
        position: "fixed",
        [theme.breakpoints.down('md')]: {
            width: "90%"
        },
    },
    drawerClose: {
        width: "0%",
        height: "100%",
        zIndex: "1150",
        position: "fixed"
    },
    drawerContentClose: {
        display: 'none'
    },
    drawerContainer: {
        left: "0px !important"
    }
})
const SnackMessage = (props) => {
    const { message } = props
    return <span className="element-flex" id="message-id"><Loader size={20} thickness={4} /> {message} </span>
}
SnackMessage.propTypes = {
    message: PropTypes.string.isRequired
}
export const CartoviewSnackBar = (props) => {
    const { handleClose, open, message } = props
    const messageComponent = <SnackMessage message={message} />
    return <Snackbar
        open={open}
        onClose={handleClose ? handleClose : () => { }}
        transition={Fade}
        SnackbarContentProps={{
            'aria-describedby': 'message-id',
        }}
        message={messageComponent} />
}
CartoviewSnackBar.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
}

function Transition(props) {
    return <Slide direction="left" {...props} />
}
class ContentGrid extends Component {
    componentDidMount() {
        const { childrenProps } = this.props
        childrenProps.map.setTarget(this.mapDiv)
    }
    componentDidUpdate(prevProps, prevState) {
        const { width } = this.props
        if (prevProps.width !== width) {
            prevProps.childrenProps.map.updateSize()
        }
    }
    render() {
        const { classes, childrenProps } = this.props
        return (
            <div className={classes.root}>
                <div className={classnames({ [classes.drawer]: childrenProps.drawerOpen ? true : false, [classes.drawerClose]: childrenProps.drawerOpen ? false : true })}>
                    <Paper className={classnames({ "drawer-button-container": true, [classes.drawerContainer]: childrenProps.drawerOpen ? false : true })}>
                        <IconButton onClick={childrenProps.toggleDrawer} color="default" aria-label="add" className={"drawer-button"}>
                            {childrenProps.drawerOpen ? <ArrowLeft /> : <ArrowRight />}
                        </IconButton>
                    </Paper>
                    <Transition in={childrenProps.drawerOpen} direction={"right"}>
                        <CartoviewDrawer exportMap={childrenProps.exportMap} config={childrenProps.config} handleLayerVisibilty={childrenProps.handleLayerVisibilty} changeLayerOrder={childrenProps.changeLayerOrder} mapLayers={childrenProps.mapLayers} urls={childrenProps.urls} legends={childrenProps.legends} className={classnames({ [classes.drawerContentClose]: !childrenProps.drawerOpen })} />
                    </Transition>
                </div>
                <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <GeoCode geocodeSearchLoading={childrenProps.geocodeSearchLoading} geocodeSearch={childrenProps.geocodeSearch} action={childrenProps.zoomToLocation} />
                        <div ref={(mapDiv) => this.mapDiv = mapDiv} className="map-panel"></div>
                        <CartoviewPopup {...childrenProps} />
                    </Grid>
                </Grid>
                <CartoviewSnackBar open={childrenProps.featureIdentifyLoading} message={"Searching For Features at this Point"} />
            </div>
        )
    }
}
ContentGrid.propTypes = {
    childrenProps: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    width: PropTypes.string,
}
export default compose(withStyles(styles), withWidth())(ContentGrid)
