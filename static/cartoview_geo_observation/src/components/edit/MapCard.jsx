import Img from 'react-image'
import PropTypes from 'prop-types'
import React from 'react'
import Spinner from 'react-spinkit'

export const MapCard = (props) => {
    const { selectMap, map, selectedMap } = props
    return (
        <div
            onClick={() => selectMap(map)}
            key={map.id}
            className={(selectedMap ? selectedMap.id == map.id : false)
                ? "row row-fix resource-box bg-success"
                : "row row-fix resource-box"}>

            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 resource-box-img-container">
                <Img
                    className="resource-box-img"
                    src={[map.thumbnail_url, "/static/app_manager/img/no-image.jpg"]}
                    loader={< Spinner name="line-scale-pulse-out" color="steelblue" />} />
            </div>

            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 resource-box-text">
                <h4>{map.title}</h4>
                <hr></hr>
                <p>
                    {map.abstract.length > 30
                        ? map.abstract.substr(0, 30) + '...'
                        : map.abstract}
                </p>
                <p>owner: {map.owner__username}</p>
                <a type="button"
                    href={`/maps/${map.id}`}
                    target="_blank"
                    className="btn btn-primary map-details-button">
                    {'Map Details'}
                </a>
            </div>
        </div>
    )
}
MapCard.propTypes = {
    selectMap: PropTypes.func.isRequired,
    map: PropTypes.object.isRequired,
    selectedMap: PropTypes.object
}