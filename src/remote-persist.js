/* eslint no-underscore-dangle: [2, { "allow": ["_loading", "_saveStatus"] }] */

import React from 'react';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isStrongPassword from 'validator/lib/isStrongPassword';

const Field = require('./field.js');
const apiClient = require('./api/client')

module.exports = class extends React.Component {
  static displayName = '10-remote-persist';

  state = {
    fields: {
    },
    fieldErrors: {},
    people: [],
    _loading: false,
    _saveStatus: 'READY'
  };

  componentDidMount() {
    this.setState({_loading: true});
    apiClient.loadPeople().then(people => {
      this.setState({_loading: false, people: people});
    });
  }

  onFormSubmit = evt => {
    const person = this.state.fields;

    evt.preventDefault();

    if (this.validate()) return;

    const people = [...this.state.people, person];

    this.setState({_saveStatus: 'SAVING'});
    apiClient
      .savePeople(people)
      .then(() => {
        this.setState({
          people: people,
          fields: {
          },
          _saveStatus: 'SUCCESS'
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({_saveStatus: 'ERROR'});
      });
  };

  onInputChange = ({name, value, error}) => {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;

    fields[name] = value;
    fieldErrors[name] = error;

    this.setState({fields, fieldErrors, _saveStatus: 'READY'});
  };

  validate = () => {
    const person = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter(k => fieldErrors[k]);

    if (!person.name) return true;
    if (!person.email) return true;
    if (!person.age) return true;
    if (!person.phoneNumber) return true;
    if (!person.password) return true;
    if (!person.homepage) return true;

    if (errMessages.length) return true;

    return false;
  };

  render() {
    if (this.state._loading) {
      return <img alt="loading" src="/img/loading.gif" />;
    }

    return (
      <div className="cf pa4 sans-serif">
        <div className="fl w-100 w-50-ns pa3">
          {this.renderForm()}
        </div>

        <div className="fl w-100 w-50-ns pa3">
          {this.renderList()}
        </div>
      </div>
    );
  };

  renderForm () {
    return (
      <div>
        <h1>Sign Up</h1>

        <form onSubmit={this.onFormSubmit}>
          <Field
            label="Name"
            placeholder="Pat Smith"
            name="name"
            value={this.state.fields.name}
            onChange={this.onInputChange}
            validate={val => (val ? false : 'Name Required')}
          />

          <Field
            label="Email"
            placeholder="pat@smith.com"
            name="email"
            value={this.state.fields.email}
            onChange={this.onInputChange}
            validate={val => (isEmail(val) ? false : 'Invalid Email')}
          />

          <Field
            label="Age"
            placeholder="33"
            name="age"
            value={this.state.fields.age}
            onChange={this.onInputChange}
            validate={val => {
              if (!isNumeric(val)) return 'Invalid Age'
              if (parseFloat(val) <= 0) return 'Invalid Age'
              if (parseFloat(val) >= 200) return 'Invalid Age'

              return false
            }}
          />

          <Field
            label="Phone Number"
            placeholder="800-555-1212"
            name="phoneNumber"
            value={this.state.fields.phoneNumber}
            onChange={this.onInputChange}
            validate={val => (isMobilePhone(val) ? false : 'Invalid Phone Number')}
          />

          <Field
            label="Password"
            placeholder="Str0ngP@ssword~"
            name="password"
            type="password"
            value={this.state.fields.password}
            onChange={this.onInputChange}
            validate={val => (isStrongPassword(val) ? false : 'Weak Password')}
          />

          <Field
            label="Homepage"
            placeholder="https://smith.com/pat"
            name="homepage"
            value={this.state.fields.homepage}
            onChange={this.onInputChange}
            validate={val => (isURL(val, { require_protocol: true }) ? false : 'Invalid URL')}
          />

          {
            {
              SAVING: <input value="Saving..." type="submit" disabled />,
              SUCCESS: <input value="Saved!" type="submit" disabled />,
              ERROR: (
                <input
                  value="Save Failed - Retry?"
                  type="submit"
                  disabled={this.validate()}
                />
              ),
              READY: (
                <input
                  value="Submit"
                  type="submit"
                  disabled={this.validate()}
                />
              )
            }[this.state._saveStatus]
          }
        </form>
      </div>
    )
  };

  renderList() {
    return (
      <div>
        <h1>People</h1>

        <div>
          <table class="f6 w-100 mw8 center" cellspacing="0">
            <thead>
              <tr>
                <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Name</th>
                <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Email</th>
                <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Age</th>
                <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Phone</th>
                <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Homepage</th>
              </tr>
            </thead>
            <tbody class="lh-copy">
          {this.state.people.map((person, i) => {
            const {name, email, age, phoneNumber, homepage} = person
            return (
              <tr key={email}>
                <td class="pv3 pr3 bb b--black-20">{name}</td>
                <td class="pv3 pr3 bb b--black-20">{email}</td>
                <td class="pv3 pr3 bb b--black-20">{age}</td>
                <td class="pv3 pr3 bb b--black-20"><a href={`tel:${phoneNumber}`}>{phoneNumber}</a></td>
                <td class="pv3 pr3 bb b--black-20"><a href={homepage}>{homepage}</a></td>
              </tr>
          )})}
        </tbody>
      </table>
        </div>
      </div>
    )
  }
};
