import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-modal";

import {
  IoIosCloseCircle,
  IoIosSearch,
  IoIosAddCircleOutline,
  IoIosPaperPlane,
} from "react-icons/io";
import { FaBars } from "react-icons/fa";

import "./style.css";
import SideNavigation from "../Components/SideNavigation";

import { newFeed } from "../redux/actions/feedAction";

import Feeds from "./Feeds";
import Messages from "./Messages";
import Contacts from "./Contacts";
import Profile from "./Profile";
import Explore from "./Explore";

class Home extends Component {
  state = {
    feedModal: false,

    user: "",
    body: "",
    media: null,
  };

  componentDidMount() {
    let user = this.props.user.username;
    this.setState({ user });
  }

  handleFeedModalFile = (e) => {
    e.preventDefault();
    console.log(e.target.name, e.target.files[0]);

    this.setState({
      media: e.target.files[0],
    });
  };

  handleFeedModalText = (e) => {
    e.preventDefault();

    let { name, value } = e.target;
    console.log(name, value);
    this.setState({ [name]: value });
  };

  submitNewFeed = (e) => {
    e.preventDefault();
    let { user, body, media } = this.state;

    if (body !== "") {
      console.log({ user, body, mediaUrl: media, mediaType: media.type });
      this.props.newFeed({
        user,
        body,
        mediaUrl: media,
        mediaType: media.type,
      });
      this.setState({ feedModal: false, body: "", media: "" });
    } else {
      alert("Type something");
    }
  };

  openSideMenu = () => {
    document.getElementById("side_menu").style = "width: 65vw; margin-left: 0";
  };

  render() {
    return (
      <div className="Home">
        <SideNavigation url={this.props.computedMatch.url} />

        <section>
          <section className="search_bar_container">
            <IoIosSearch
              size={20}
              onClick={this.openSideMenu}
              color="blue"
              className="toggle_search"
            />
            <FaBars
              size={25}
              onClick={this.openSideMenu}
              color="blue"
              className="toggle_bars"
            />

            <input
              style={{
                flex: 1,
                margin: "0 12px",
                borderRadius: 12,
                border: "none",
                height: 30,
                padding: "0 6px",
                fontSize: 16,
              }}
              placeholder="search..."
              onChange={this.handleSearch}
              type="search"
              name="search"
              id="search"
            />

            <IoIosAddCircleOutline
              onClick={() => this.setState({ feedModal: true })}
              style={{
                backgroundColor: "#e1e1e1",
                borderRadius: 20,
                padding: 4,
                marginLeft: 8,
                cursor: "pointer",
              }}
              size={20}
              color="blueviolet"
            />
            {/* 
            <Link
              style={{
                backgroundColor: "#e1e1e1",
                borderRadius: 20,
                padding: 0,
                margin: "auto 8px",
              }}
              to="/explore"
            >
              <IoIosNavigate
                size={20}
                color="blueviolet"
              />
            </Link> */}
          </section>

          <Route
            exact
            path={`${this.props.computedMatch.url}`}
            component={Feeds}
          />
          <Route
            exact
            path={`${this.props.computedMatch.url}messages`}
            component={Messages}
          />
          <Route
            exact
            path={`${this.props.computedMatch.url}contacts`}
            component={Contacts}
          />
          <Route
            exact
            path={`${this.props.computedMatch.url}settings`}
            component={Feeds}
          />
          <Route
            exact
            path={`${this.props.computedMatch.url}profile/:userId`}
            component={Profile}
          />

          <Route
            exact
            path={`${this.props.computedMatch.url}explore`}
            component={Explore}
          />
        </section>

        <Modal
          ariaHideApp={false}
          isOpen={this.state.feedModal}
          onRequestClose={() => this.setState({ feedModal: false })}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.326)",
              zIndex: 310,
              display: "flex",
            },
            content: {
              // top: "30%",
              // left: "50%",
              // right: "auto",
              // bottom: "auto",
              // marginRight: "-50%",
              // transform: "translate(-50%, -50%)",

              width: "50%",
              height: "fit-contents",
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              flexDirection: "column",
              borderRadius: 12,
              border: "none",
            },
          }}
          contentLabel="Example Modal"
        >
          <div style={{ display: "flex" }}>
            <h1>Create feed</h1>
            <IoIosCloseCircle
              onClick={() => this.setState({ feedModal: false })}
              size={20}
              color="red"
              style={{ marginLeft: "auto" }}
            />
          </div>
          <form
            className="new_feed_form_container"
            onSubmit={this.submitNewFeed}
          >
            <textarea
              onChange={this.handleFeedModalText}
              name="body"
              value={this.state.body}
              id=""
              cols="30"
              rows="10"
              placeholder="What's on your mind?"
            ></textarea>

            <input
              style={{
                backgroundColor: "rgba(137, 43, 226, 0.19)",
                borderRadius: 20,
                padding: "8px 12px",
                display: "flex",
                margin: 6,
              }}
              onChange={this.handleFeedModalFile}
              name="media"
              value={this.state.mediaUrl}
              type="file"
            />

            <IoIosPaperPlane size={20} />
            <input type="submit" value="POST" />
          </form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { newFeed })(Home);