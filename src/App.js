import { useEffect, useState } from "react";
import List from "./components/list/List";
import store from "./utils/store";
import { v4 as uuid } from "uuid";
import StoreApi from "./utils/storeApi";
import InputContainer from "./components/input/InputContainer";
import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { db } from "./firebase";
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

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "pink",
    width: "100%",
    overflowY: "auto",
  },
}));

function App() {
  const classes = useStyle();
  const [data, setData] = useState();

  useEffect(() => {
    const q = query(collection(db, `users/9kJmphJPxM2yseOh8zsK/projects/`));
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
      doc(db, `users/9kJmphJPxM2yseOh8zsK/projects/${data[0].id}`),
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
      doc(db, `users/9kJmphJPxM2yseOh8zsK/projects/${data[0].id}`),
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
      doc(db, `users/9kJmphJPxM2yseOh8zsK/projects/${data[0].id}`),
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
    <StoreApi.Provider value={{ addMoreCard, addMoreList, updateListTitle }}>
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
      </DragDropContext>
    </StoreApi.Provider>
  );
}

export default App;
