import React, { Component } from 'react';

let FormButton = props => {

    return (

      <div className="col-xs-12" style={{ padding: "0" }}>

        <button type="submit" name="Submit" className={props.loading ? "btn btn-md btn-login col-xs-11" : "btn btn-md btn-login btn-block"} disabled={props.loading ? "disabled" : false}> {props.title} </button>
        {props.loading ? <img src='/static/images/loading.gif' alt="loading gif" className="col-xs-1" /> : null}

      </div>

    );

}

export default FormButton