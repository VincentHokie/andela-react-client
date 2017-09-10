import React, { Component } from 'react';

class FormButton extends Component {

  render() {

    return (

      <div className="col-xs-12" style={{ padding: "0" }}>
      
      <button type="submit" name="Submit" className={ this.props.loading ? "btn btn-md btn-login col-xs-11" : "btn btn-md btn-login btn-block" } disabled={ this.props.loading ? "disabled" : false }>Create Shopping List</button>
      { this.props.loading ? <img src='/static/images/loading.gif' alt="loading gif image" className="col-xs-1" /> : null }

      </div>

    );
  }

}


export default FormButton