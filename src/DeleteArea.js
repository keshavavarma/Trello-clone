import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";

const useStyle = makeStyles((theme) => ({
  deleteArea: {
    display: "inline",
    position: "fixed",
    top: "85vh",
    left: "90vw",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.2)",
    fontSize: "1.3rem",
    fontWeight: "bold",
    // color: "white",
    padding: "1rem",
    "&:hover": {
      color: "white",
      fontSize: "2rem",
      borderRadius: "0.5rem",
      background: "rgba(0,0,0,0.5)",
    },
  },
}));

const DeleteArea = () => {
  const classes = useStyle();
  return (
    <Droppable droppableId="delete" type="delete">
      {(provided) => {
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={classes.deleteArea}
        >
          <DeleteIcon fontSize="large" />
        </div>;
      }}
    </Droppable>
  );
};

export default DeleteArea;
