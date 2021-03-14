import React from "react";
import { Modal } from "antd";
import { StarFilled, DeleteFilled } from "@ant-design/icons";

import "./FriendsList.index.css";

interface IProps {
  id: string;
  name: string;
  isUsersFriends: boolean;
  handleFriendFavoriteClick: (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  isFavorite: boolean;
  handleFriendRemoveClick: (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const FriendsListItem: React.FC<IProps> = (props) => {
  const [modal] = Modal.useModal();

  return (
    <div className="friends-list-item">
      <div className="name-section">
        <p className="name" title={props.name}>
          {props.name}
        </p>
        <p
          className="name-info"
          title={props.isUsersFriends ? "is your friend" : "Add to your list"}
        >
          {props.isUsersFriends ? "is your friend" : "Add to your list"}
        </p>
      </div>
      <div className="action-section">
        <button
          className="favorite-btn"
          onClick={props.handleFriendFavoriteClick.bind(null, props.id)}
          title="Favorite"
        >
          {props.isFavorite ? (
            <StarFilled style={{ color: "#FFD700" }} />
          ) : (
            <StarFilled style={{ color: "#adadad" }} />
          )}
        </button>
        <button
          className="remove-btn"
          onClick={props.handleFriendRemoveClick.bind(null, props.id)}
          // onClick={() => {
          //   modal.confirm({
          //     title: "Are you sure you want to remove?",
          //     onOk: props.handleFriendRemoveClick.bind(null, props.id),
          //   });
          // }}
          title="Remove"
        >
          <DeleteFilled />
        </button>
      </div>
    </div>
  );
};

export default React.memo(FriendsListItem);
