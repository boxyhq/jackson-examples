import React, { Component } from 'react';
import PropTypes from 'prop-types';

import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

import 'highlight.js/styles/monokai-sublime.css';

const registeredLanguages = {};

class Highlight extends Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false };
    this.codeNode = React.createRef();
  }

  async componentDidMount() {
    const { language } = this.props;

    if (language && !registeredLanguages[language]) {
      try {
        hljs.registerLanguage('json', json);

        registeredLanguages[json] = true;

        this.setState({ loaded: true }, this.highlight);
      } catch (e) {
        console.error(e);
        throw Error(`Cannot register the language ${language}`);
      }
    } else {
      this.setState({ loaded: true });
    }
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    this.codeNode && this.codeNode.current && hljs.highlightBlock(this.codeNode.current);
  };

  render() {
    const { language, children } = this.props;
    const { loaded } = this.state;

    if (!loaded) {
      return null;
    }

    return (
      <pre className='rounded'>
        <code ref={this.codeNode} className={language}>
          {children}
        </code>
      </pre>
    );
  }
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string,
};

Highlight.defaultProps = {
  language: 'json',
};

export default Highlight;
