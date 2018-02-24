import { HashRouter, Route, Switch } from 'react-router-dom'

import GeoCollect from 'Source/containers/geo_observation/GeoCollect'
import Main from 'Source/containers/Main'
import React from 'react'
import { getCRSFToken } from 'Source/helpers/helpers.jsx'
import { render } from 'react-dom'

class Viewer {
    constructor(domId, username, urls, instanceId) {
        this.domId = domId
        this.urls = urls
        this.username = username
        this.instanceId = instanceId
    }
    loadConfig() {
        return fetch(this.urls.appInstance, {
            method: 'GET',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            })
        }).then((response) => response.json())
    }
    view() {
        this.loadConfig().then((res) => {
            this.config = {
                config: res.config,
                title: res.title,
                abstract: res.abstract,
                map: res.map
            }

            render(
                < HashRouter >
                    <div className="full-height">
                        <Switch>
                            <Route
                                exact
                                path={"/"}
                                render={(props) => <GeoCollect {...props} config={this.config} username={this.username} urls={this.urls} instanceId={this.instanceId} />}
                            />
                            <Route
                                exact
                                path={`/:fid/edit`}
                                render={(props) => <GeoCollect {...props} config={this.config} username={this.username} urls={this.urls} instanceId={this.instanceId} />}
                            />
                        </Switch>
                    </div>
                </HashRouter >,
                document.getElementById(this.domId))
        })
    }
    viewMain() {
        this.loadConfig().then((res) => {
            this.config = {
                config: res.config,
                title: res.title,
                abstract: res.abstract,
                map: res.map
            }
            render(
                <Main config={this.config} username={this.username} urls={this.urls} instanceId={this.instanceId} />,
                document.getElementById(this.domId))
        })
    }
}
global.Viewer = Viewer
