import { Loader, Message } from 'Source/containers/CommonComponents'

import Img from 'react-image'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    legendsPaper: {
        padding: theme.spacing.unit*2,
        textAlign:"center"
    }
})
const LegendItem = (props) => {
    const { legend } = props
    return (
        <div className="full-width element-block">
            <Message align="center" message={`${legend.layer}`} type={"body1"} />
            <Img src={[
                legend.url
            ]}
                loader={<Loader align="center" size={30} />} />
        </div>
    )
}
LegendItem.propTypes = {
    legend: PropTypes.object.isRequired
}
class CartoviewLegends extends React.Component {
    render() {
        const {
            classes,
            legends
        } = this.props
        return (
            <Paper className={classes.legendsPaper} elevation={0}>
                {legends.length > 0 && legends.map((legend, index) => <LegendItem key={index} legend={legend} />)}
                {legends.length === 0 && <Message message="No Legends" align="center" type="body1" />}
            </Paper>
        )
    }
}
CartoviewLegends.propTypes = {
    classes: PropTypes.object.isRequired,
    legends: PropTypes.array.isRequired,
}
export default withStyles(styles)(CartoviewLegends)
