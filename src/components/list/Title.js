import React, { useContext, useState } from "react";
import { Typography, InputBase, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import storeApi from "../../utils/storeApi";

const useStyle = makeStyles((theme) => ({
  editableTitleContainer: {
    margin: theme.spacing(1),
    display: "flex",
  },
  editableTitle: {
    cursor: "text",
    flexGrow: 1,
    wordBreak: "break-all",
    maxWidth: "300px",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  input: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: theme.spacing(1),
    "&:focus": {
      background: "#ddd",
    },
  },
  deleteBtn: {
    padding: "0",
  },
}));
export default function Title({ title, listId, index }) {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { updateListTitle, deleteList } = useContext(storeApi);
  const classes = useStyle();
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleOnBlur = () => {
    updateListTitle(newTitle, listId);
    setOpen(false);
  };
  return (
    <div>
      {open ? (
        <div>
          <InputBase
            autoFocus
            value={newTitle}
            inputProps={{
              className: classes.input,
            }}
            fullWidth
            onChange={handleOnChange}
            onBlur={handleOnBlur}
          />
        </div>
      ) : (
        <div className={classes.editableTitleContainer}>
          <Typography
            onClick={() => setOpen(!open)}
            className={classes.editableTitle}
          >
            {title}
          </Typography>
          <IconButton
            className={classes.deleteBtn}
            onClick={() => {
              deleteList(listId, index);
            }}
          >
            <CloseIcon color="error" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
