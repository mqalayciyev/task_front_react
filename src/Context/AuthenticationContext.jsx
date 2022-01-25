import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AuthenticationContext = React.createContext();
AuthenticationContext.displayName = "AuthenticationContext";

class AuthenticationContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null,
      expiry: null,
      boards: null,
    };
  }
  componentDidMount = async (event) => {
    if (localStorage.hasOwnProperty("authentication")) {
      let authentication = JSON.parse(localStorage.getItem("authentication"));

      axios.interceptors.request.use(
        (config) => {
          config.headers.authorization = `Bearer ${authentication.token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}/control`
      );

      response = response.data;
      if (response.status === "success") {
        this.setState({
          isAuthenticated: true,
          user: authentication.user,
        });
        this.loadBoard()
      }
      if (response.status === "error") {
        this.setState({
          isAuthenticated: false,
          user: null,
          token: null,
          expiry: null,
        });
        localStorage.removeItem("authentication");
      }
    }
  };
  authLogin = (authentication) => {
    this.setState({
      isAuthenticated: true,
      user: authentication.user,
      token: authentication.token,
      expiry: authentication.expiry,
    });
  };
  authLogout = () => {
    this.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      expiry: null,
      boards: null,
    });
  };
  loadBoard = async () => {
    let authentication = JSON.parse(localStorage.getItem("authentication"));

    axios.interceptors.request.use(
      (config) => {
        config.headers.authorization = `Bearer ${authentication.token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );


    let response = await axios.get(
      `${process.env.REACT_APP_API_URL}/load-board`
    );

    response = response.data;

    console.log(response);
    if (response.status === "success") {
      let boards = response.data.length > 0 ? response.data : null
      this.setState({boards: boards})

    }
  };

  render() {
    return (
      <AuthenticationContext.Provider
        value={{
          ...this.state,
          authLogin: this.authLogin,
          authLogout: this.authLogout,
          updateData: this.updateData,
          loadBoard: this.loadBoard,
        }}
      >
        {this.props.children}
      </AuthenticationContext.Provider>
    );
  }
}

export default AuthenticationContextProvider;
