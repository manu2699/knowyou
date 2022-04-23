import React, { useReducer } from "react";

import FilledInput from "@mui/material/FilledInput";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
// import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

import doRequest from "./../utils/requestHooks";

import styles from "./styles.module.css";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function MainPage() {
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			email: "",
			name: "",
			age: "",
			password: "",
			confirmPassword: "",
			showPassword: false,
			showCPassword: false,
			emailError: "",
			passwordError: "",
			isNewUser: false
		}
	);

	return (
		<div className={styles.mainPage}>
			user
		</div>
	);
}
