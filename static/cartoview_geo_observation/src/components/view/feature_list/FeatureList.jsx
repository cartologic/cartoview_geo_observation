import React, { Component } from 'react'

import { CircularProgress } from 'material-ui/Progress'
import FeatureCard from 'Source/components/view/feature_list/FeatureCard'
import UltimatePaginationMaterialUi from './MaterialPagination'
import classNames from 'classnames'
import { getPropertyFromConfig } from 'Source/utils/utils'
import noImage from 'Source/img/no-img.png'
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
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center'

    }
})
class FeatureList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1
        }
    }
    loading = () => {
        const { childrenProps } = this.props
        return (childrenProps.featuresIsLoading || childrenProps.attachmentIsLoading || childrenProps.commentsIsLoading)
    }
    render() {
        const { classes, match, location, childrenProps } = this.props
        return (
            <div className={classNames({ [classes.loadingContainer]: this.loading() })}>
                <div className="feature-card-container">
                    {childrenProps.features.length > 0 && childrenProps.features.map((feature, index) => {
                        const title = getPropertyFromConfig(childrenProps.config, 'titleAttribute', null)
                        const subtitle = getPropertyFromConfig(childrenProps.config, 'subtitleAttribute', null)
                        const imageEnabled = getPropertyFromConfig(childrenProps.config, 'enableImageListView', null)
                        const description = subtitle ? feature.getProperties()[subtitle] : subtitle
                        const featureId = feature.getId()
                        const attachments = childrenProps.searchFilesById(featureId)
                        const comments = childrenProps.searchCommentById(featureId)
                        const editURL = childrenProps.urls.editObservation(featureId)
                        const cardProps = {
                            title: feature.getProperties()[title],
                            description,
                            files: attachments.length,
                            comments: comments.length,
                            imageSrc: [
                                attachments && attachments.length > 0 ? attachments[0].file : null,
                                noImage

                            ],
                            imageEnabled,
                            featureId,
                            location,
                            match,
                            feature,
                            editURL

                        }
                        return <FeatureCard key={index} delete={() => childrenProps.deleteFeature(feature, index)} {...cardProps} />
                    })}



                </div>
                {!childrenProps.selectionModeEnabled && !childrenProps.detailsModeEnabled && !(childrenProps.featuresIsLoading || childrenProps.attachmentIsLoading) && childrenProps.totalFeatures > 0 && <div className="text-center element-flex">
                    <UltimatePaginationMaterialUi
                        totalPages={Math.ceil(childrenProps.totalFeatures / parseInt(childrenProps.config.pagination))}
                        currentPage={childrenProps.totalFeatures > 0 ? this.state.currentPage : 0}
                        boundaryPagesRange={1}
                        onChange={number => this.setState({ currentPage: number }, childrenProps.getFeatures((number - 1) * parseInt(childrenProps.config.pagination)))} />
                </div>}
                {this.loading() && <CircularProgress className={classes.progress} thickness={7} />}

            </div>
        )
    }
}
export default withStyles(styles)(FeatureList)