import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import logo from "./logo.png";
import { ToastContainer, toast } from "react-toastify";
import { AuthenticationContext } from "./Context/AuthenticationContext";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import serialize from "form-serialize";

function App() {
  const context = useContext(AuthenticationContext);
  const [boards, setBoards] = useState(null);
  const [taskUpdateAdd, setTaskUpdateAdd] = useState(false);
  const login = async (event) => {
    event.preventDefault();
    // console.log(this.context)
    // return false

    var data = serialize(event.target, { hash: true });

    let response = await axios.post(
      `${process.env.REACT_APP_API_URL}/login`,
      data
    );

    response = response.data;

    // console.log(response)
    if (response.status === "success") {
      toast.success(response.message);
      localStorage.setItem(
        "authentication",
        JSON.stringify(response.authentication)
      );
      context.authLogin(response.authentication);
      window.location.href = "/";
    }
    if (response.status === "warning") {
      let message = response.message;
      for (const value of Object.values(message)) {
        for (let i = 0; i < value.length; i++) {
          toast.warning(value[i]);
        }
      }
    }
    if (response.status === "error") {
      toast.error(response.message);
    }
  };
  const register = async (event) => {
    event.preventDefault();

    var data = serialize(event.target, { hash: true });

    let response = await axios.post(
      `${process.env.REACT_APP_API_URL}/register`,
      data
    );

    response = response.data;

    console.log(response);
    if (response.status === "success") {
      toast.success(response.message);
      localStorage.setItem(
        "authentication",
        JSON.stringify(response.authentication)
      );
      context.authLogin(response.authentication);
      window.location.href = "/";
    }
    if (response.status === "warning") {
      let message = response.message;
      for (const value of Object.values(message)) {
        for (let i = 0; i < value.length; i++) {
          toast.warning(value[i]);
        }
      }
    }
    if (response.status === "error") {
      toast.error(response.message);
    }
  };
  const logout = async () => {
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
    let response = await axios.post(
      `${process.env.REACT_APP_API_URL}/logout`
    );
    response = response.data;

    if (response.status === "success") {
      toast.info(response.message);
      localStorage.removeItem("authentication");
      context.authLogout();
      window.location.href = "/";
    }
  };
  const addUpdateTask = async (event) => {
    event.preventDefault();
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

    var data = serialize(event.target, { hash: true });

    let response = await axios.post(
      `${process.env.REACT_APP_API_URL}/add-update-task`,
      data
    );

    response = response.data;

    console.log(response);
    if (response.status === "success") {
      toast.success(response.message);
      context.loadBoard();
      event.target.reset()
    }
    if (response.status === "warning") {
      let message = response.message;
      for (const value of Object.values(message)) {
        for (let i = 0; i < value.length; i++) {
          toast.warning(value[i]);
        }
      }
    }
  };
  const addUpdateBoard = async (event) => {
    event.preventDefault();
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

    var data = serialize(event.target, { hash: true });

    let response = await axios.post(
      `${process.env.REACT_APP_API_URL}/add-update-board`,
      data
    );

    response = response.data;

    console.log(response);
    if (response.status === "success") {
      toast.success(response.message);
      context.loadBoard();
      event.target.reset()
    }
    if (response.status === "warning") {
      let message = response.message;
      for (const value of Object.values(message)) {
        for (let i = 0; i < value.length; i++) {
          toast.warning(value[i]);
        }
      }
    }
  };

  const updateBoard = (e, item) => {
    document.querySelector("#addBoard input[name='id']").value = item.id
    document.querySelector("#addBoard input[name='title']").value = item.title
    document.querySelector(".modal_show").click()
  }
  const updateAddTask = (e, item, task) => {
    document.querySelector("#board-" + item.id +" input[name='title']").value = task ? task.title : null
    document.querySelector("#board-" + item.id +" textarea[name='description']").value = task ? task.description : null
    document.querySelector("#board-" + item.id +" input[name='id']").value = task ? task.id : 0
    if(task){
      document.querySelector("#board-" + item.id +" .updateCreate").classList.remove('d-none')
    }
    else{
      document.querySelector("#board-" + item.id +" .updateCreate").classList.toggle('d-none')
    }
    
  }

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <AuthenticationContext.Consumer>
      {(context) => {
        return (
          <>
            <ToastContainer />
            <div className="container-fluid bg-white">
              <div className="col-12">
                <div className="row bg-info align-items-center">
                  <div className="col-6 py-2">
                    <img src={logo} style={{ width: "40px" }} alt="task_logo" />
                  </div>
                  <div className="col-6">
                    <div className="dropdown">
                      <div className="text-end">
                        {!context.isAuthenticated ? (
                          <>
                            <button
                              className="btn btn-success"
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#loginModal"
                            >
                              Login
                            </button>

                            <button
                              className="btn btn-primary"
                              style={{ marginLeft: "15px" }}
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#registerModal"
                            >
                              Register
                            </button>
                          </>
                        ) : null}
                        {context.isAuthenticated ? (
                          <div class="dropdown">
                            <span className="circle-img rounded-circle d-inline-flex align-items-center">
                            {context.user.name.charAt(0).toUpperCase()}
                            </span>
                            <a
                              class="btn dropdown-toggle text-primary d-inline-flex align-items-center"
                              href="#"
                              role="button"
                              id="dropdownMenuLink"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {context.user.name}
                            </a>
                            <ul
                              className={`dropdown-menu`}
                              aria-labelledby="dropdownMenuLink"
                            >
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={() => logout()}
                                >
                                  Logout
                                </a>
                              </li>
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-between">
                  <div className="col-12 pt-2">
                    <h3>Task Board</h3>
                  </div>
                  <div className="col-12 pb-2">
                    <Slider {...settings}>
                      {context.boards ? (
                        context.boards.map((item) => (
                          <div className="task-slider-item" id={`board-${item.id}`}>
                            <div className="background-grey">
                              <div className="row m-0">
                                <div className="col-10 py-2" onDoubleClick={(e) => updateBoard(e, item)}>
                                  {item.title}{" "}
                                  <span class="badge bg-secondary">
                                    {item.tasks.filter(item =>item.user_id === context.user.id).length}
                                  </span>
                                </div>
                                <div className="col-2 py-2">
                                  <span
                                    className="rounded-circle bg-grey modal_show"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addBoard"
                                  >
                                    <i class="fa fa-plus"></i>
                                  </span>
                                </div>
                              </div>
                              <div className="row m-0">
                                <div className="col-12 my-3">
                                  <form 
                                    className="updateCreate d-none"
                                    onSubmit={addUpdateTask}
                                  >
                                    <input type="hidden" name="id" value="0" />
                                    <input
                                      type="hidden"
                                      name="board_id"
                                      value={item.id}
                                    />
                                    <div className="form-group mb-2">
                                      <input
                                        className="form-control"
                                        name="title"
                                        placeholder="Title"
                                      />
                                    </div>
                                    <div className="form-group mb-2">
                                      <textarea
                                        className="form-control"
                                        name="description"
                                        placeholder="Description"
                                      ></textarea>
                                    </div>
                                    <div className="form-group mb-2">
                                      <button className="btn btn-success w-100">
                                        Add
                                      </button>
                                    </div>
                                  </form>
                                  <button className="btn btn-secondary w-100" onClick={(e) => updateAddTask(e, item)}>
                                    <i class="fa fa-plus"></i> Add Task
                                  </button>
                                </div>
                                <div className="col-12 ">
                                {
                                  item.tasks.length > 0 ? item.tasks.filter(item =>item.user_id === context.user.id).map(task => <div className="card">
                                    <div id={task.id} className="card-body" onDoubleClick={(e) => updateAddTask(e, item, task)}>
                                      <h5>{task.title}</h5>
                                      <p>
                                        {task.description}
                                      </p>
                                    </div>
                                  </div>) : null
                                }
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="task-slider-item">
                          <div className="background-grey">
                            <div className="row m-0">
                              <div className="col-10 py-2">New Board</div>
                              <div className="col-2 py-2">
                                <span
                                  className="rounded-circle bg-grey"
                                  data-bs-toggle="modal"
                                  data-bs-target="#addBoard"
                                >
                                  <i class="fa fa-plus"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Slider>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="modal fade"
              id="addBoard"
              tabIndex="-1"
              aria-labelledby="addBoardLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <form onSubmit={addUpdateBoard}>
                  <div class="modal-content">
                    <div class="modal-body">
                      <div className="form-group mb-2">
                        <input type="hidden" value="0" name="id" />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Board name"
                          name="title"
                        />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="submit" class="btn btn-primary">
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              class="modal fade"
              id="loginModal"
              tabIndex="-1"
              aria-labelledby="loginModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <form onSubmit={login}>
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="loginModalLabel">
                        Sign in Account
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div className="form-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          name="password"
                        />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="submit" class="btn btn-primary">
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              class="modal fade"
              id="registerModal"
              tabIndex="-1"
              aria-labelledby="registerModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <form onSubmit={register}>
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="registerModalLabel">
                        Create Account
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div className="form-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Full Name"
                          name="name"
                        />
                      </div>
                      <div className="form-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          name="password"
                        />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="submit" class="btn btn-primary">
                        Register
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        );
      }}
    </AuthenticationContext.Consumer>
  );
}

export default App;
