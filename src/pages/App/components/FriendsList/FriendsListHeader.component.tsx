import React from "react";
import { SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";
import { TsortDirection } from "./FriendsList.model";

interface IProps {
  sortClickHandler: () => void;
  sortDirection: TsortDirection;
}

const FriendsListHeader: React.FC<IProps> = (props) => {
  return (
    <div className="header">
      <h3 className="header-text" title="Friends List">
        Friends List
      </h3>
      <button
        className="sort-btn"
        onClick={props.sortClickHandler}
        title="Sorting By Favorite"
      >
        Favorite Sort
        {props.sortDirection === "asc" ? (
          <SwapRightOutlined />
        ) : (
          <SwapLeftOutlined />
        )}
      </button>
    </div>
  );
};

export default React.memo(FriendsListHeader);
