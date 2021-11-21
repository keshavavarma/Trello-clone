import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "10vh",
    background: "rgba(0,0,0,0.2)",
    // background:
    //   "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
    width: "100%",
    padding: "0 2rem",
    boxShadow: "0px 10px 10px -12px rgba(0, 0, 0, 0.5)",
    // overflow: "auto",
  },
  profile: {
    display: "flex",
    justifyContent: "space-between",
    width: "8rem",
  },
  projectTitle: {
    border: "none",
    // background: "none",
    background: "rgba(0,0,0,0.5)",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "white",
    padding: "1rem",

    borderRadius: "0.5rem",
  },
}));

const Header = () => {
  const classes = useStyle();
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logoutHandler = async () => {
    setAnchorEl(null);
    try {
      await logout();
      history.push("/Login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={classes.navbar}>
      <div>
        <button
          className={classes.projectTitle}
          id="demo-positioned-button"
          aria-controls="demo-positioned-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Kanban Board
        </button>
        {/* TODO: To add Multiple Projects functionality */}
        {/* <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={() => setDarkMode(!darkMode)}>
            {!darkMode ? (
              <>
                <p>Dark</p>
                <DarkModeIcon sx={{ marginLeft: "0.5rem" }} />
              </>
            ) : (
              <>
                <p>Light</p>
                <LightModeIcon sx={{ color: "Orange", marginLeft: "0.5rem" }} />
              </>
            )}
          </MenuItem>
          <MenuItem onClick={logoutHandler}>
            Logout <LogoutIcon sx={{ marginLeft: "0.5rem" }} />
          </MenuItem>
        </Menu> */}
      </div>
      <div className={classes.profile}>
        <IconButton onClick={logoutHandler}>
          <LogoutIcon sx={{ marginLeft: "0.5rem", color: "white" }} />
        </IconButton>
        <Avatar
          src={
            currentUser &&
            (currentUser.photoURL
              ? currentUser.photoURL
              : `https://avatars.dicebear.com/api/initials/${currentUser.displayName}.svg`)
          }
        />
      </div>
    </div>
  );
};

export default Header;
