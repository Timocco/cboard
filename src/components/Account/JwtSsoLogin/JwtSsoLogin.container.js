import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { login } from '../Login/Login.actions';
import messages from './JwtSsoLogin.messages';
import { getUser } from '../../App/App.selectors';
import './JwtSsoLogin.css';

class JwtSsoLoginContainer extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    user: PropTypes.object,
    login: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {
      match: {
        params: { token }
      },
      history
    } = this.props;
    this.token = token;
    this.type = 'ssoLogin';

    if (this.hasErrors) {
      setTimeout(() => {
        history.replace('/');
      }, 3000);
    }

    this.state = {
      loggedIn: false
    };
  }

  componentDidMount() {
    if (!this.state.loggedIn) {
      this.props.login({ email: this.type, password: this.token }, this.type);
    }
  }

  componentDidUpdate() {
    this.checkUser();
  }

  checkUser() {
    const { history, user } = this.props;
    if (user.email) {
      history.replace('/');
    }

    this.setState({ loggedIn: true });
  }

  render() {
    return (
      <div className="JwtSsoContainer">
        {!this.hasErrors && <FormattedMessage {...messages.loading} />}
        {this.hasErrors && <FormattedMessage {...messages.errorMessage} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
});

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(JwtSsoLoginContainer));
