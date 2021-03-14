import React from "react";
import { message, Pagination } from "antd";
import { v4 as uuidv4 } from "uuid";

import FriendsListItem from "./FriendsListItem.component";
import FriendsListHeader from "./FriendsListHeader.component";

import { TsortDirection } from "./FriendsList.model";

import "./FriendsList.index.css";

interface IFrieldsItem {
  id: string;
  name: string;
  isUsersFriends: boolean;
  isFavorite: boolean;
}

const itemsPerPage = 4;

const FriendsList: React.FC<any> = (props) => {
  /* Input Value State */
  const [getInputValue, setInputValue] = React.useState<string>("");

  const storageFriends = localStorage.getItem("FRIENDS");

  const initialFriendsState = storageFriends ? JSON.parse(storageFriends) : [];

  /* Friends List State */
  const [getFriends, setFriends] = React.useState<IFrieldsItem[]>(
    initialFriendsState
  );

  const [getSearchData, setSearchData] = React.useState<{
    data: IFrieldsItem[];
    length: number;
  }>({ data: initialFriendsState, length: initialFriendsState.length });

  const [getPage, setPage] = React.useState<number>(1);

  const [getSortDirection, setSortDirection] = React.useState<TsortDirection>(
    "asc"
  );

  /**
   * Serach functionality
   */
  const serchFunctionality = () => {
    try {
      if (typeof getInputValue === "string") {
        const newSearchData = getFriends.filter((o) =>
          testValueWithName(getInputValue, o.name)
        );
        setSearchData({
          data: getTrimmedData(sortByFavorite(newSearchData)),
          length: newSearchData.length,
        });
      }
    } catch (error) {
      console.error(
        "Dev Handled Exception Error:: [serchFunctionality FN] :: ",
        error
      );
    }
  };

  const sortByFavorite = (data: IFrieldsItem[]): IFrieldsItem[] => {
    let sortedData: IFrieldsItem[] = data;

    try {
      if (getSortDirection === "asc") {
        sortedData = data.sort(
          (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
        );
      } else if (getSortDirection === "dsc") {
        sortedData = data.sort(
          (a, b) => Number(a.isFavorite) - Number(b.isFavorite)
        );
      }
    } catch (error) {
      console.error(
        "Dev Handled Exception Error:: [sortByFavorite FN] :: ",
        error
      );
    }

    return sortedData;
  };

  /**
   * this function to get sliced array using pagination data
   * @param data
   * @param start
   * @param end
   * @returns
   */
  const getTrimmedData = (
    data: any[],
    start?: number,
    end: number = itemsPerPage
  ): any[] => {
    const _start = start || Number(itemsPerPage * getPage) - itemsPerPage;
    // const _end = end || Number(itemsPerPage * getPage);
    const trimmedData = [...data].splice(_start, end);

    return trimmedData;
  };

  /**
   * This function will match val with name and retuns boolean value.
   * If match found then function will return true else will return false.
   * @param val :: Expecting Input Value
   * @param name :: Expecting Frields Name
   * @returns
   */
  const testValueWithName = (val: string, name: string): boolean => {
    const regex = new RegExp(val, "gi");
    const testRes = regex.test(name);

    return testRes;
  };

  /**
   * Favorite Button click handler
   * @param event
   */
  const handleFriendFavoriteClick = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    try {
      setFriends((prevState) => {
        const newState = prevState.map((o) => {
          if (o.id === id) {
            return {
              ...o,
              isFavorite: !o.isFavorite,
            };
          } else return o;
        });
        return newState;
      });
    } catch (error) {
      console.error(
        "Dev Handled Exception Error:: [handleFriendRemoveClick FN] :: ",
        error
      );
    }
  };

  /**
   * Friend Remove Button click handler
   * @param event
   */
  const handleFriendRemoveClick = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    try {
      setFriends((prevState) => {
        const newState = prevState.filter((o) => o.id !== id);
        return newState;
      });
    } catch (error) {
      console.error(
        "Dev Handled Exception Error:: [handleFriendRemoveClick FN] :: ",
        error
      );
    }
  };

  /**
   * Handled Enter Keyevent On Input
   * @param event
   */
  const handleInputEnter = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.code === "Enter") {
      try {
        const val = getInputValue.trim();
        if (val) {
          // eslint-disable-next-line no-useless-escape
          if (new RegExp(/[^a-zA-Z0-9 \-\/]/).test(val)) {
            message.destroy();
            message.error("Name is not alphanumeric!");
          } else {
            const allNamesArr = getFriends.map((o) => o.name);
            if (allNamesArr.includes(val)) {
              message.destroy();
              message.error(`${val} is already exist in your friends list.`);
              return;
            } else {
              // add
              setFriends((prevState) => {
                const removeUnfriends = prevState.filter(
                  (o) => o.isUsersFriends
                );
                return [
                  ...removeUnfriends,
                  {
                    id: uuidv4(),
                    name: val,
                    isUsersFriends: true,
                    isFavorite: false,
                  },
                ];
              });
            }
          }
          setInputValue("");
        } else {
          message.destroy();
          message.error("Please Enter Valid Name!");
        }
      } catch (error) {
        console.error(
          "Dev Handled Exception Error:: [handleInputEnter FN] :: ",
          error
        );
      }
    }
  };

  /**
   * Handled Change Event On Input
   * @param event
   */
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    try {
      // eslint-disable-next-line no-useless-escape
      if (new RegExp(/[^a-zA-Z0-9 \-\/]/).test(event.target.value)) {
        message.destroy();
        message.error("Name must not contain any special characters!");
      } else {
        setInputValue(event.target.value);
      }
    } catch (error) {
      console.error(
        "Dev Handled Exception Error:: [handleInputChange FN] :: ",
        error
      );
    }
  };

  /**
   * Pagination change event handler
   * @param page
   * @param pageSize
   */
  const handlePageChange = (page: number, pageSize?: number): void => {
    setPage(page);
  };

  const sortClickHandler = () => {
    setSortDirection((prevState) => (prevState === "asc" ? "dsc" : "asc"));
  };

  React.useEffect(() => {
    try {
      // storing list in localstorage.
      localStorage.setItem("FRIENDS", JSON.stringify(getFriends));
      if (getInputValue) {
        serchFunctionality();
      } else {
        setSearchData({
          data: getTrimmedData(sortByFavorite(getFriends)),
          length: getFriends.length,
        });
      }
    } catch (error) {
      console.error(
        "Dev Handled Exception Error:: [getFriends useEffect FN] :: ",
        error
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFriends]);

  // Filtering searchData on input change value
  React.useEffect(() => {
    serchFunctionality();
    setPage(1); //resetting  page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInputValue, getSortDirection]);

  // After page change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(serchFunctionality, [getPage]);

  return (
    <div className="friends-container">
      <FriendsListHeader
        sortDirection={getSortDirection}
        sortClickHandler={sortClickHandler}
      />
      <input
        type="text"
        name="name"
        id="newFriendsName"
        maxLength={20}
        autoComplete="off"
        placeholder="Enter your friend's name"
        title="Enter your friend's name to search or add new friend"
        value={getInputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputEnter}
      />
      <div className="friends-list-container">
        {getSearchData.length > 0 ? (
          getSearchData.data.map((o: IFrieldsItem) => (
            <FriendsListItem
              key={o.id}
              id={o.id}
              name={o.name}
              isUsersFriends={o.isUsersFriends}
              isFavorite={o.isFavorite}
              handleFriendRemoveClick={handleFriendRemoveClick}
              handleFriendFavoriteClick={handleFriendFavoriteClick}
            />
          ))
        ) : (
          <p className="no-data-view">
            {getFriends.length === 0
              ? "Sorry, No Friends Found On Your Friend List!"
              : "Sorry, Friend Not Found!"}
          </p>
        )}
        {getSearchData.length > 0 ? (
          <div className="pagination-container">
            <Pagination
              current={getPage}
              total={getSearchData.length}
              hideOnSinglePage
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(FriendsList);
