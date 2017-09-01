import Img from 'react-image'
import PropTypes from 'prop-types'
import React from 'react'
import Slider from 'react-slick'
import Spinner from "react-spinkit"
import { connect } from 'react-redux'
import noImage from '../img/no-img.png'
class ItemDetails extends React.Component {
    constructor( props ) {
        super( props )
    }
    searchFilesById = ( id ) => {
        let result = [ ]
        this.props.files.map( ( imageObj ) => {
            if ( imageObj.is_image && imageObj.feature_id ===
                id ) {
                result.push( imageObj )
            }
        } )
        return result
    }
    render( ) {
        let {
            selectedFeatures
        } = this.props
        const settings = {
            dots: true,
            fade: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        }
        return (
            <div>
            <div className="row">
                <div style={{ paddingRight: 10, paddingLeft: 10 }} className="col-xs-12 col-sm-12 col-md-6 col-md-offset-3">
                    {this.searchFilesById(selectedFeatures[0].getId()).length > 0 && <Slider style={{ marginRight: 'auto', marginLeft: 'auto' }} {...settings}>
                        {this.searchFilesById(selectedFeatures[0].getId()).map(
                            (imageObj, i) => {
                                return <div key={i}><Img
                                    src={[
                                        imageObj.file,
                                        noImage
                                    ]}
                                    loader={<Spinner className="loading-center" name="line-scale-party" color="steelblue" />}
                                    className="img-responsive" />
                                </div>
                            }
                        )}
                    </Slider>}
                </div>
            </div>
            <hr />

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(selectedFeatures[0].getProperties()).map((key, i) => {
                        if (key != "geometry") {
                            return <tr key={i}>
                                <td>{key}</td>
                                <td style={{ whiteSpace: 'pre-line' }}>{selectedFeatures[0].getProperties()[key]}</td>
                            </tr>
                        }
                    })}
                </tbody>
            </table>
        </div>
        )
    }
}
ItemDetails.propTypes = {
    selectedFeatures: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired
}
const mapStateToProps = ( state ) => {
    return {
        selectedFeatures: state.selectedFeatures,
        files: state.files
    }
}
export default connect( mapStateToProps )( ItemDetails )
