import React, { useState, useContext } from "react";
import { IconButton, Paper } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@material-ui/core/styles";
import storeApi from "../utils/storeApi";

const useStyle = makeStyles((theme) => ({
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    wordBreak: "break-all",
    maxWidth: "300px",
    padding: theme.spacing(1, 1, 1, 2),
    margin: theme.spacing(1),
  },
  deleteBtn: {
    padding: "0",
  },
}));
export default function Card({ card, index, list }) {
  const classes = useStyle();
  const [hover, setHover] = useState();
  const { deleteCard } = useContext(storeApi);
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Paper
            className={classes.card}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {card.title}
            {hover && (
              <IconButton
                className={classes.deleteBtn}
                onClick={() => {
                  deleteCard(index, list.id);
                }}
              >
                <CloseIcon color="error" fontSize="small" />
              </IconButton>
            )}
          </Paper>
        </div>
      )}
    </Draggable>
  );
}
