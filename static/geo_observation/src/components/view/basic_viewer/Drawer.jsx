import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'

import CameraIcon from 'material-ui-icons/PhotoCamera'
import CartoviewAbout from 'Source/components/view/basic_viewer/About'
import CartoviewLayerSwitcher from 'Source/components/view/basic_viewer/LayerSwitcher'
import CartoviewLegends from 'Source/components/view/basic_viewer/Legends'
import CollapsibleListItem from 'Source/components/view/basic_viewer/CollapsibleItem'
import HomeIcon from 'material-ui-icons/Home'
import ImageIcon from 'material-ui-icons/Image'
import InfoIcons from 'material-ui-icons/Info'
import LayersIcons from 'material-ui-icons/Layers'
import { Link } from 'react-router-dom'
import ListIcon from 'material-ui-icons/List'
import MapIcon from 'material-ui-icons/Map'
import NavBar from 'Source/components/view/basic_viewer/NavBar.jsx'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        height: "100%",
        overflowY: 'overlay'
    },
    drawerPaper: {
        padding: theme.spacing.unit,
    }
})
class CartoviewDrawer extends React.Component {
    state = {
        about: false
    }
    handleAboutChange = () => {
        const { about } = this.state
        this.setState({ about: !about })
    }
    render() {
        const {
            classes,
            className,
            legends,
            urls,
            mapLayers,
            changeLayerOrder,
            handleLayerVisibilty,
            config,
            exportMap
        } = this.props
        const { about } = this.state
        return (
            <Paper elevation={6} className={classnames(classes.root, className)}>
                <NavBar config={config} />
                <Paper className={classes.drawerPaper} elevation={0}>
                    <List>
                        {!config.config.components.featureList && <ListItem component={Link} to={"/list/"} button>
                            <ListItemIcon>
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Feature List" />
                        </ListItem>}
                        {!config.config.components.basicViewer && <ListItem component={Link} to={"/viewer"} button>
                            <ListItemIcon>
                                <MapIcon />
                            </ListItemIcon>
                            <ListItemText primary="Map" />
                        </ListItem>}
                        <ListItem onTouchTap={() => window.location.href = urls.appInstancesPage} button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem onTouchTap={this.handleAboutChange} button>
                            <ListItemIcon>
                                <InfoIcons />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItem>
                        <ListItem onTouchTap={exportMap} button>
                            <ListItemIcon>
                                <CameraIcon />
                            </ListItemIcon>
                            <ListItemText primary="Export Map" />
                        </ListItem>
                        <CollapsibleListItem open={false} title="Layers" icon={<LayersIcons />} >
                            <CartoviewLayerSwitcher handleLayerVisibilty={handleLayerVisibilty} changeLayerOrder={changeLayerOrder} mapLayers={mapLayers} />
                        </CollapsibleListItem>
                        <CollapsibleListItem open={false} title="Legend" icon={<ImageIcon />} >
                            <CartoviewLegends legends={legends} />
                        </CollapsibleListItem>
                        <CartoviewAbout open={about} title={config.title} abstract={config.formAbstract} close={this.handleAboutChange} />
                    </List>
                </Paper>
            </Paper >
        )
    }
}
CartoviewDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    changeLayerOrder: PropTypes.func.isRequired,
    legends: PropTypes.array.isRequired,
    urls: PropTypes.object.isRequired,
    mapLayers: PropTypes.array.isRequired,
    handleLayerVisibilty: PropTypes.func.isRequired,
    exportMap: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
}
export default withStyles(styles)(CartoviewDrawer)
