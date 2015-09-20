import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    const { dispatch, files } = this.props;

    const fileComponents = files.map(f => {
      return (
        <div key={f.id}>{f.fullpath}</div>
      )
    });
    return (
      <div>
        {fileComponents}
      </div>
    );
  }
}

function select(state) {
  return {
    files: state.files
  }
}

export default connect(select)(App);
