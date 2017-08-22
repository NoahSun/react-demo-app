import React, { Component } from 'react';
import { Button } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const BasicExample = () => (
  <Router>
    <div>
      <img src={logo} className="App-logo" alt="" srcSet="" />
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <Route exact path="/home" component={Home}></Route>
      <Route path="/about" component={About}></Route>
      <Route path="/topics" component={Topics}></Route>

    </div>
  </Router>
)

const Home = (props) => (
  <div>
    <h2>Home</h2>
    <pre>{JSON.stringify(props, null, 4)}</pre>
  </div>
);

const About = ({ match }) => (
  <div>
    <h2>About</h2>
    <ul>
      <li>
        <Link to={`${match.url}/1`}>id-1</Link>
      </li>
      <li>
        <Link to={`${match.url}/2`}>id-2</Link>
      </li>
      <li>
        <Link to={`${match.url}/3`}>id-3</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:id`} component={AbourWithId} />

  </div>
);

const AbourWithId = (props) => (
  <div>
    <h2>About with id's params. Id: {props.match.params.id}</h2>
    <pre>{JSON.stringify(props, null, 4)}</pre>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}></Route>
  </div>
);

const Topic = (props) => (
  <div>
    <pre>{JSON.stringify(props, null, 4)}</pre>
  </div>
);

const AuthExample = () => (
  <Router>
    <div>

      <AuthButton />

      <ul>
        <li>
          <Link to="/public">公共页面</Link>
        </li>
        <li>
          <Link to="/protected">需授权访问页面</Link>
        </li>
      </ul>

      <Route path="/public" component={Public} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/protected" component={Login} />

    </div>
  </Router>
);

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
}

const AuthButton = withRouter((props) => {
  console.log(props);
  const { history, location, match } = props;
  return fakeAuth.isAuthenticated ? (
    <p>
      欢迎！
      <Button onClick={() => {
        fakeAuth.signout(() => history.push('/public'));
      }}>退出</Button>
    </p>
  ) : location.pathname === '/login' ? (<p></p>) : (
    <p>
      请 <Button onClick={() => {
        fakeAuth.authenticate(() => history.push('/protected'))
      }}>登陆</Button>
    </p>
  );
});

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: 'login',
            state: {
              from: props.location
            }
          }} />
        )
    )} />
  )
}

const Public = () => <h3>公公页面</h3>
const Protected = () => <h3>授权页面</h3>

class Login extends Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <BasicExample></BasicExample>
        <AuthExample></AuthExample>
      </div>
    );
  }
}

export default App;
