import React, { Suspense } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { publicRoutes, listOfPages } from "./publicRoutes";
import Base from "../layout/Base";
import Loading from "../loading/Loading";

class AppRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.currentKey = props.location.pathname.split("/")[1] || "/";
    this.timeout = { enter: 500, exit: 500 };
    this.state = {
      currentUser: {
        roles: [],
        name: "",
        email: "",
        isLoggedIn: false,
      },
      availableRoutes: [],
      isLoading: true,
    };
  }

  componentDidMount = () => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: false,
    }));
  };

  mapRoute = (routeData) => {
    let Component = routeData.component;
    return (
      <Route
        key={routeData.path}
        path={routeData.path}
        exact={routeData.exact}
        render={(props) => (
          <Component {...props} currentUser={this.state.currentUser} />
        )}
      />
    );
  };

  getSimplePageContent = () => {
    return (
      // Page Layout component wrapper
        <Base
          currentUser={this.state.currentUser}
          history={this.props.history}
        >
          <Suspense fallback={<Loading />}>
            <Switch location={this.props.location}>
              {publicRoutes.map(this.mapRoute)}
            </Switch>
          </Suspense>
        </Base>
    );
  };

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    } else {
      let content = this.getSimplePageContent();
      return content;
    }
  }
}

AppRoutes.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.array,
    userName: PropTypes.string,
    email: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.object
  })
};

export default withRouter(AppRoutes);
