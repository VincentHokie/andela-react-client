import React, { Component } from 'react';

let FormError = props => {
    return (<span className="label label-danger">{props.error}<br /></span>);
}

export default FormError