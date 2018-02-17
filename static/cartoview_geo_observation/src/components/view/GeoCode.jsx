import GeoCodeSearchInput from 'Source/components/view/SearchInput'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import React from 'react'

export default class GeoCode extends React.Component {
    render() {
        const { geocodeSearch, action,geocodeSearchLoading } = this.props
        return (
            <Grid className="geocode-search" container justify="center" alignItems={"stretch"} spacing={0}>
                <Grid item xs={8} sm={8} md={6} lg={6} xl={6}>
                    <GeoCodeSearchInput geocodeSearchLoading={geocodeSearchLoading} search={geocodeSearch} action={action} />
                </Grid>
            </Grid>
        )
    }
}
GeoCode.propTypes = {
    geocodeSearch: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    geocodeSearchLoading:PropTypes.bool.isRequired
}