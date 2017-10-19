import React, { Component } from 'react';

class FormButton extends Component {

  render() {

    return (

      <div className="col-xs-12" style={{ padding: "0" }}>

        <button type="submit" name="Submit" className={this.props.loading ? "btn btn-md btn-login col-xs-11" : "btn btn-md btn-login btn-block"} disabled={this.props.loading ? "disabled" : false}> {this.props.title} </button>
        {this.props.loading ? <img src='/static/images/loading.gif' alt="loading gif" className="col-xs-1" /> : null}

      </div>

    );
  }

}


export default FormButton