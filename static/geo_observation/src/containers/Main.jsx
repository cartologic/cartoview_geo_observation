import 'typeface-roboto'

import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import React, { Component } from 'react'

import BasicViewerContainer from 'Source/containers/basic_viewer/BasicViewer'
import Button from 'material-ui/Button'
import FeatureDetails from 'Source/components/view/feature_list/FeatureDetails'
import FeatureListContainer from 'Source/containers/FeatureList'
import MenuIcon from 'material-ui-icons/Menu'
import { MuiThemeProvider } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Sidenav from 'Source/components/view/feature_list/Sidenav'
import Wraper from 'Source/components/view/feature_list/Wraper'
import proj from 'ol/proj'
import proj4 from 'proj4'
import { theme } from 'Source/components/view/feature_list/theme.jsx'
import { withStyles } from 'material-ui/styles'

proj.setProj4(proj4)
const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
    container: {
        height: 'calc(100% - 96px)'
    },
    scrolling: {
        overflowY: 'overlay'
    },
    button: {
        margin: theme.spacing.unit,
        position: 'fixed',
        zIndex: 1
    },
});
class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: false
        }
    }
    hanldeDrawerOpen = () => {
        const { drawerOpen } = this.state
        this.setState({ drawerOpen: !drawerOpen })
    }
    render() {
        const { config, urls, classes } = this.props
        return (
            <div>
                <Button onClick={this.hanldeDrawerOpen} variant="fab" color="primary" aria-label="add" className={classes.button}>
                    <MenuIcon />
                </Button>
                <Sidenav config={config} urls={urls} drawerOpen={this.state.drawerOpen} hanldeDrawerOpen={this.hanldeDrawerOpen} />
            </div>
        )
    }
}
const NavBarApp = withStyles(styles)(NavBar)
class Main extends Component {
    getFeatureListComponent = () => {
        const { config, urls } = this.props
        const el = (props) => (<main>
            <NavBarApp config={config} urls={urls} />
            <Wraper {...props}><FeatureListContainer config={config.config} urls={urls} {...props} /></Wraper>
        </main>)
        return el
    }
    getBasicViewerComponent = () => {
        const { config, urls, username } = this.props
        const el = (props) => <BasicViewerContainer username={username} config={config} urls={urls} {...props} />
        return el
    }
    render() {
        const { config, username, urls } = this.props
        const components = [{ 'Component': this.getFeatureListComponent(), url: "/list/", hide: config.config.components.featureList }, { 'Component': this.getBasicViewerComponent(), url: "/viewer", hide: config.config.components.basicViewer }]
        const getDefaultComponent = () => {
            let defaultComponent = { url: '/list' }
            for (let i = 0; i < components.length; i++) {
                const c = components[i]
                if (!c.hide) {
                    defaultComponent = c
                    break
                }
            }
            return defaultComponent
        }
        return (
            <HashRouter ref={(node) => this.routeHistory = node}>
                <MuiThemeProvider theme={theme}>
                    <div className="full-height">
                        <Switch>
                            <Route exact path="/" render={() => (

                                <Redirect to={getDefaultComponent().url} />

                            )} />
                            {components.map((component, index) => {
                                let routeProps = {
                                    path: component.url
                                }
                                if (!component.hide) {
                                    routeProps.exact = true
                                    return <Route
                                        key={index}
                                        {...routeProps}
                                        render={(props) => (<component.Component {...props} />)}
                                    />
                                }
                            })}
                            <Route
                                exact
                                path={`/list/:typename/:fid/details`}
                                render={(props) => <main>
                                    <NavBarApp config={config} urls={urls} />
                                    <Wraper {...props}><FeatureDetails username={username} config={config.config} urls={urls} {...props} /></Wraper>
                                </main>}
                            />
                        </Switch>

                    </div>
                </MuiThemeProvider>
            </HashRouter>
        )
    }
}
Main.propTypes = {
    classes: PropTypes.object.isRequired,
    username: PropTypes.string,
    urls: PropTypes.object.isRequired,
    instanceId: PropTypes.number.isRequired,
    config: PropTypes.object.isRequired
}

export default withStyles(styles)(Main)