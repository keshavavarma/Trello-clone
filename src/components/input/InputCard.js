import React, { useContext, useState } from "react";
import { Paper, InputBase, Button, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/core/styles";
import storeApi from "../../utils/storeApi";

const useStyle = makeStyles((theme) => ({
  card: {
    width: "280px",
    margin: theme.spacing(0, 1, 1, 1),
    paddingBottom: theme.spacing(4),
  },
  input: {
    margin: theme.spacing(1),
  },
  btnConfirm: {
    background: "#5AAC44",
    color: "#fff",
    "&:hover": {
      background: "#5AAC44BF",
    },
  },
  confirm: {
    margin: theme.spacing(0, 1, 1, 1),
  },
}));

export default function InputCard({ setOpen, listId, type }) {
  const classes = useStyle();
  const { addMoreCard, addMoreList } = useContext(storeApi);
  const [title, setTitle] = useState("");

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleBtnConfirm = () => {
    if (type === "card") {
      if (title) {
        addMoreCard(title, listId);
      }
      setTitle("");
      setOpen(false);
    } else {
      if (title) {
        addMoreList(title);
      }
      setTitle("");
      setOpen(false);
    }
  };

  return (
    <div>
      <div>
        <Paper className={classes.card}>
          <InputBase
            autoFocus
            multiline
            onChange={handleOnChange}
            // onBlur={() => setOpen(false)}
            // the above line is causing some issue with the first mouse click on the Add card/list button in the adjacent div...https://stackoverflow.com/questions/58106099/react-onclick-not-firing-on-first-click-second-click-behaves-as-expected-simpl
            fullWidth
            inputProps={{
              className: classes.input,
            }}
            value={title}
            placeholder={
              type === "card"
                ? "Enter a title of this card.."
                : "Enter list title..."
            }
          />
        </Paper>
      </div>
      <div
        className={classes.confirm}
        onClick={() => {
          console.log("clicked");
        }}
      >
        <Button className={classes.btnConfirm} onClick={handleBtnConfirm}>
          {type === "card" ? "Add Card" : "Add List"}
        </Button>
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
}
