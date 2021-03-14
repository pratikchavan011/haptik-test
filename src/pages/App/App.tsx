import React from "react";
import { FriendsList } from "./components/index";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="main-container">
        <FriendsList />
      </div>
    </div>
  );
};

export default React.memo(App);
