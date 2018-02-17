import Select, { AsyncCreatable } from 'react-select'

import React from 'react'
import ReactTooltip from 'react-tooltip'

let toolTipId = 0;
export const getKeywordsTemplate = ( options ) => {
    function renderInput( locals ) {
        toolTipId++;
        return <div style={{ paddingTop: 5, paddingBottom: 5 }} className={locals.hasError ? "has-error" : ""}>
            <label className={"control-label"}>{locals.label}</label>
            <AsyncCreatable
                {...locals}
                onChange={locals.onChange}
                inputProps={locals.inputProps}
                loadOptions={options.loadOptions}
                value={locals.value}
                multi={true}
                deleteRemoves={true}
                resetValue={null}
                placeholder={options.message} />
            {options.help&&<div>
            <p className="help-block"><i data-tip data-for={`id-${toolTipId}`} className="fa fa-info-circle pull-right" aria-hidden="true"></i></p>
            <ReactTooltip getContent={()=>options.help} type="info" place="left" effect="solid" id={`id-${toolTipId}`} />
        </div>}
        </div>
    }
    return renderInput
}
export const getAttributesTemplate = ( options ) => {
    function renderInput( locals ) {
        toolTipId++;
        return <div style={{ paddingTop: 5, paddingBottom: 5 }} className={locals.hasError ? "has-error" : ""}>
            <label className={"control-label"}>{locals.label}</label>
            <Select
                {...locals}
                onChange={locals.onChange}
                inputProps={locals.inputProps}
                options={options.options}
                value={locals.value}
                multi={true}
                required={false}
                deleteRemoves={true}
                resetValue={null}
                placeholder={options.message} />
           {options.help&&<div>
            <p className="help-block"><i data-tip data-for={`id-${toolTipId}`} className="fa fa-info-circle pull-right" aria-hidden="true"></i></p>
            <ReactTooltip getContent={()=>options.help} type="info" place="left" effect="solid" id={`id-${toolTipId}`} />
        </div>}
        </div>
    }
    return renderInput
}
