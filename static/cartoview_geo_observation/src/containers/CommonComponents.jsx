import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
export const Loader = (props) => {
    const { size, thickness, align, type } = props
    return (
        <div className={`text-${align || "center"}`} >
            {(typeof (type) === "undefined" || type === "circle") && <CircularProgress size={size ? size : 50} thickness={thickness ? thickness : 5} className="text-center"></CircularProgress>}
            {type === "line" && <LinearProgress size={size ? size : 50} thickness={thickness ? thickness : 5} className="text-center"></LinearProgress>}
        </div>
    )
}
Loader.propTypes = {
    size: PropTypes.number,
    thickness: PropTypes.number,
    align: PropTypes.string,
    type: PropTypes.string
}
export const Message = (props) => {
    const { align, type, message, color, noWrap } = props
    return <Typography type={type} align={align ? align : "center"} noWrap={typeof (noWrap) !== "undefined" ? noWrap : message.length > 70 ? true : false} color={color ? color : "inherit"} className="element-flex">{message}</Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string,
    color: PropTypes.string,
    noWrap: PropTypes.bool,
}
