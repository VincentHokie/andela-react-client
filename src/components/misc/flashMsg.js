import React from 'react';

let FlashMsg = props => {
    return (

      <div className="alert alert-info message col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
        <strong><i className="fa fa-info-circle"></i></strong> {props.msg}
      </div>

    );
}

export default FlashMsg