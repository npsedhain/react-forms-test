import PropTypes from 'prop-types';
import React from 'react';

module.exports = class extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    validate: PropTypes.func,
    onChange: PropTypes.func.isRequired
  };

  static getDerivedStateFromProps = (nextProps) => {
    return {value: nextProps.value}
  };

  state = {
    value: this.props.value,
    hasBlurred: false,
    error: false
  };

  onChange = evt => {
    const name = this.props.name;
    const value = evt.target.value;
    const error = this.props.validate ? this.props.validate(value) : false;

    this.setState({value, error: this.state.hasBlurred ? error : false});

    this.props.onChange({name, value, error});
  };

  onBlur = evt => {
    this.setState({hasBlurred: true})
    const name = this.props.name;
    const value = this.state.value || ''
    const error = this.props.validate ? this.props.validate(value) : false;

    this.setState({value, error});

    this.props.onChange({name, value, error});
  }

  render() {
    return (
      <div>
        <label class="db fw6 lh-copy f6">
        {this.props.label || this.props.name}
        <input className="pa2 input-reset ba w-100"
          name={this.props.name}
          type={this.props.type || 'text'}
          placeholder={this.props.placeholder}
          value={this.state.value || ''}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
        </label>
        <div className='red mt2'>{this.state.error}</div>
      </div>
    );
  }
};
