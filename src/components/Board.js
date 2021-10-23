import { useEffect, useState } from "react";
import List from "./list/List";
import store from "../utils/store";
import { v4 as uuid } from "uuid";
import StoreApi from "../utils/storeApi";
import InputContainer from "./input/InputContainer";
import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  addDoc,
  where,
  getDocs,
  QuerySnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import Header from "./header/Header";
import DeleteArea from "../DeleteArea";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "90vh",
    // background: "rgb(63,9,121)",
    // background:
    //   "linear-gradient(297deg, rgba(63,9,121,1) 39%, rgba(4,0,255,1) 100%)",
    // background: "rgb(131,58,180)",
    // background:
    //   "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
    // background: "rgb(63,94,251)",
    // background:
    //   "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
    width: "100%",
    padding: "1rem 0",
    overflowY: "auto",
  },
}));

const Board = () => {
  const classes = useStyle();
  const [data, setData] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, `users/${currentUser.uid}/projects/`));
    const unsub = onSnapshot(q, (snapshot) => {
      setData(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });
    return unsub;
  }, []);

  const addMoreCard = async (title, listId) => {
    const newCardId = uuid();
    const newCard = {
      id: newCardId,
      title,
    };

    const list = data[0].data.lists[listId];
    list.cards = [...list.cards, newCard];

    const newState = {
      ...data[0].data,
      lists: {
        ...data[0].data.lists,
        [listId]: list,
      },
    };
    await setDoc(
      doc(db, `users/${currentUser.uid}/projects/${data[0].id}`),
      newState
    );
  };
  const addMoreList = async (title) => {
    const newListId = uuid();
    const newList = {
      id: newListId,
      title,
      cards: [],
    };
    const newState = {
      listIds: data[0].data.listIds
        ? [...data[0].data.listIds, newListId]
        : [newListId],
      lists: {
        ...data[0].data.lists,
        [newListId]: newList,
      },
    };
    await setDoc(
      doc(db, `users/${currentUser.uid}/projects/${data[0].id}`),
      newState
    );
  };
  const updateListTitle = async (title, listId) => {
    const list = data[0].data.lists[listId];
    list.title = title;

    const newState = {
      ...data[0].data,
      lists: {
        ...data[0].data.lists,
        [listId]: list,
      },
    };
    await setDoc(
      doc(db, `users/${currentUser.uid}/projects/${data[0].id}`),
      newState
    );
  };

  const deleteCard = async (index, listID) => {
    const sourceList = data[0].data.lists[listID];
    sourceList.cards.splice(index, 1);
    const newState = {
      ...data[0].data,
      lists: {
        ...data[0].data.lists,
        [listID]: sourceList,
      },
    };
    await setDoc(
      doc(db, `users/${currentUser.uid}/projects/${data[0].id}`),
      newState
    );
  };

  const deleteList = async (listID, index) => {
    const newListIds = data[0].data.listIds;
    newListIds.splice(index, 1);
    const newLists = data[0].data.lists;
    delete newLists[listID];
    const newState = {
      listIds: newListIds,
      lists: newLists,
    };
    await setDoc(
      doc(db, `users/${currentUser.uid}/projects/${data[0].id}`),
      newState
    );
  };

  // to persist to database just remove the code for newState and setData() and add queries to the database

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    console.log("destination", destination, "source", source, draggableId);
    if (!destination) {
      return;
    }
    if (type === "list") {
      const newListIds = data[0].data.listIds;

      newListIds.splice(source.index, 1);
      newListIds.splice(destination.index, 0, draggableId);

      const newSate = {
        listIds: newListIds,
        lists: {
          ...data[0].data.lists,
        },
      };

      await setDoc(
        doc(db, `users/9kJmphJPxM2yseOh8zsK/projects/${data[0].id}`),
        newSate
      );
      return;
    }
    const sourceList = data[0].data.lists[source.droppableId];
    const destinationList = data[0].data.lists[destination.droppableId];
    const draggingCard = sourceList.cards.filter(
      (card) => card.id === draggableId
    )[0];
    // filter returns an array, but we want only the object in that array so...we add [0]
    console.log("draggingCard", draggingCard);

    if (source.droppableId === destination.droppableId) {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);
      const newSate = {
        ...data[0].data,
        lists: {
          ...data[0].data.lists,
          [sourceList.id]: destinationList,
        },
      };

      await setDoc(
        doc(db, `users/9kJmphJPxM2yseOh8zsK/projects/${data[0].id}`),
        newSate
      );
    } else {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);

      const newState = {
        ...data[0].data,
        lists: {
          ...data[0].data.lists,
          [sourceList.id]: sourceList,
          [destinationList.id]: destinationList,
        },
      };
      await setDoc(
        doc(db, `users/9kJmphJPxM2yseOh8zsK/projects/${data[0].id}`),
        newState
      );
    }
  };
  return (
    <>
      <Header />
      <StoreApi.Provider
        value={{
          addMoreCard,
          addMoreList,
          updateListTitle,
          deleteCard,
          deleteList,
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="app" type="list" direction="horizontal">
            {(provided) => (
              <div
                className={classes.root}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {data &&
                  data[0].data.listIds &&
                  data[0].data.listIds.map((listId, index) => {
                    const list = data[0].data.lists[listId];
                    return <List list={list} key={listId} index={index} />;
                  })}
                <InputContainer type="list" />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* <DeleteArea /> */}
        </DragDropContext>
      </StoreApi.Provider>
    </>
  );
};

export default Board;
