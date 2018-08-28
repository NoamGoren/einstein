import errors from './data.json';
import './css/App.css';
//import FormClass from './Form.js';
import DBEdit from './dbEdit';
import 'bootstrap/dist/css/bootstrap.min.css';
import Collapse from 'react-css-collapse';

import React, { Component } from 'react';


const texts = {
    title: 'Einstein',
    steps: 'Steps',
    info: 'Info'
};


class Item extends Component {
    render() {
        return (
            <li key={this.props.description}>
                <div>{this.props.description}</div>
                {this.props.children}
            </li>
        )
    }
}

class Action extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapse: false
        };
    }

    list(steps) {
        const children = SubSteps => SubSteps ? <ul>{this.list(SubSteps)}</ul> : null;
        return steps.map(node => {
            return (
                <Item key={node.Description} description={node.Description}>  {children(node.Steps)} </Item>
            )
        })
    }

    handleTitleClick(title, link) {
        if (link)
            this.props.handleAction(title);
        else {
            this.setState({
                collapse: !this.state.collapse
            });
        }
    }

    render() {
        return (
            <div>
                <button type="button" id={"Action-"+this.props.title} className="accordion bg-info text-white"
                        onClick={()=>{this.handleTitleClick(this.props.title, this.props.link)}}>{this.props.title}</button>
                <Collapse className="steps bg-white text-info" isOpen={this.state.collapse}>
                    <ol className="pt-3">{this.list(this.props.steps)}</ol>
                </Collapse>
            </div>
        )
    }
}


class Actions extends Component {
    constructor(props) {
        super(props);
    }


    showActions(actions) {
        return actions.map(node => {
            return (
                <Action title={node.Title} link={node.Link} key={node.Description} description={node.Description}
                        steps={node.Steps}> </Action>
            )
        })
    }

    render() {
        return (
            <div>
                {this.showActions(this.props.actions)}
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.showError = this.showError.bind(this);
        this.handleAction = this.handleAction.bind(this);

        // 1. props always exists

        // 2. state NOT always exists

        this.state = {
            title: 'Errors Research Tool',
            code: '',
            errorDefintion: null,
            actions: [],
            steps: []
        };
    }

    handleChange(event) {
        const code = event.target.value;
        this.showError(code);
        // this.createMap(this.state.data, event.target.value);
    }

    handleAction(code) {
        this.showError(code);
    }

    showError(code) {
        const errorDefintion = errors.find(item => item.Code === code);
        this.setState({
            code,
            errorDefintion
        });
    }


    render() {
        const getErrorDescription = () => {
            return (
                <div>
                    <div className="card text-center bg-info text-white mb-resp">
                        <div className="card-body">
                            <h4>Description</h4>
                            <p>{this.state.errorDefintion.Description}</p>
                        </div>
                    </div>
                </div>
            );
        };

        const getErrorType = () => {
            return (
                <div className="mb-2">
                    <div className="card text-center border-info mb-resp">
                        <div className="card-body">
                            <h4 className="text-info">Error Type</h4>
                            <p className="text-muted">{this.state.errorDefintion.Type}</p>
                        </div>
                    </div>
                </div>
            );
        };

        const getErrorInfo = () => {
            if (this.state.errorDefintion) {
                return (
                    <div>
                        {getErrorType()}
                        {getErrorDescription()}
                    </div>
                )
            }
            else {
                return (
                    <div>
                    </div>
                );
            }
        };

        const getErrorSteps = () => {
            if (this.state.errorDefintion) {
                return (
                    <div>
                        <Actions actions={this.state.errorDefintion.Actions} handleAction={this.handleAction}/>
                    </div>
                )
            }
            else if (!this.state.code == '') {
                return (
                    <div>
                        <DBEdit code={this.state.code}></DBEdit>
                    </div>
                );
            }
            else {
                return (
                    <div>
                    </div>
                );
            }
        };

        return (
            <div>
                <div id="search-section" className="bg-info row section px-5 py-4">
                    <div className="col-xl-6 section">

                        <div className="input-group">
                            <input className="form-control" type="text" placeholder="Please enter an error code..."
                                   value={this.state.code}
                                   onChange={this.handleChange}/>
                        </div>
                    </div>
                </div>

                <div id="infoContainer" className="row section bg-dark text-light pt-3">
                    <div className="px-5 col-sm-9 col-xs-12">
                        <div className="h2">{texts.steps}</div>
                        <hr />
                        {getErrorSteps()}
                    </div>
                    <div className="col-sm-3 col-xs-12">
                        <div className="h2">{texts.info}</div>
                        <hr />

                        {getErrorInfo()}
                    </div>
                </div>
            </div>
        );

    }
}

export default App;
