import React, { Component } from 'react';
import '../styles/css/404.css';

class NotFound extends Component {

    constructor() {
        super();
        this.pushNavigation = this.pushNavigation.bind(this);
    }

    pushNavigation(event) {
        this.props.history.push(event.target.getAttribute("href"))
    }

    render() {

        return (

            <div className="body-404">

                <div className="container">

                    <section className="error-wrapper">
                        <i className="icon-404"></i>
                        <h1>404</h1>
                        <h2>page not found</h2>
                        <p className="page-404">Something went wrong or that page doesn’t exist yet. <a href="index.html" onClick={this.pushNavigation}>Return Home</a></p>
                    </section>

                </div>

            </div>

        );
    }
}

export default NotFound