import React, { Component } from 'react';

class FormError extends Component {

render() {
  return ( <span className="label label-danger">{ this.props.error }<br/></span> );
}

}

export default FormError