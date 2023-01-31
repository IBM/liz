import React, { Component } from "react";
import { Content } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import TutorialHeader from "./components/TutorialHeader";
import LandingPage from "./content/LandingPage";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <>
        <TutorialHeader />
        <Content className="app__full-height">
          <Routes>
            <Route
              exact={true}
              path="/daniel-haischt/liz/"
              element={<LandingPage />}
            />
          </Routes>
        </Content>
      </>
    );
  }
}

export default App;
