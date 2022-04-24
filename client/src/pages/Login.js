import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";


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

export default function LoginPage() {
	const navigate = useNavigate();
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

	function handleStateChange(key, value) {
		setState({ [key]: value });
	}

	function handleClickShowPassword(isConfirmPass = false) {
		if (isConfirmPass) {
			setState({ showCPassword: !state.showCPassword });
		} else {
			setState({ showPassword: !state.showPassword });
		}
	}


	function handlePrimaryAction() {
		state.isNewUser ? handleSignup() : handleLogin();
	}

	async function handleLogin() {
		await doRequest({
			url: `/api/auth/signin`,
			method: "post",
			body: { email: state.email, password: state.password },
			onSuccess: ({ data }) => {
				localStorage.setItem("token", data.token);
				localStorage.setItem("id", data.user._id);
				navigate(`/`);
			},
			onError: (err) => {
				console.log(err);
				if (typeof err === "object") alert(err[0].msg);
				else alert(err);
			}
		});
	}

	async function handleSignup() {
		if (state.password === state.confirmPassword) {
			await doRequest({
				url: `/api/auth/signup`,
				method: "post",
				body: {
					name: state.name,
					email: state.email,
					password: state.password
				},
				onSuccess: () => {
					alert("Registration Success!");
					window.location.reload();
				},
				onError: (err) => {
					if (typeof err === "object") alert(err[0].msg);
					else alert(err);
				}
			});
		} else {
			alert("Both Passwords must be same");
		}
	}

	function handleSignupToggle() {
		setState({ isNewUser: !state.isNewUser });
	}

	return (
		<div className={styles.pageContainer}>
			<div className={styles.loginContainer}>
				<div className={styles.appName}>BUMPUP</div>
				{state.isNewUser && (
					<React.Fragment>
						<FormControl
							sx={{ m: 1, width: "35ch" }}
							variant='filled'>
							<InputLabel htmlFor='filled-adornment-name'>
								Name
							</InputLabel>
							<FilledInput
								type={"text"}
								id='filled-adornment-name'
								value={state.name}
								onChange={(e) =>
									handleStateChange("name", e.target.value)
								}
							/>
						</FormControl>
						<FormControl
							sx={{ m: 1, width: "35ch" }}
							variant='filled'>
							<InputLabel htmlFor='filled-adornment-age'>
								Age
							</InputLabel>
							<FilledInput
								type={"text"}
								id='filled-adornment-age'
								value={state.age}
								onChange={(e) =>
									handleStateChange("age", e.target.value)
								}
							/>
						</FormControl>
					</React.Fragment>
				)}
				<FormControl sx={{ m: 1, width: "35ch" }} variant='filled'>
					<InputLabel htmlFor='filled-adornment-email'>
						Email
					</InputLabel>
					<FilledInput
						type={"email"}
						id='filled-adornment-email'
						value={state.email}
						onChange={(e) =>
							handleStateChange("email", e.target.value)
						}
					/>
				</FormControl>
				<FormControl sx={{ m: 1, width: "35ch" }} variant='filled'>
					<InputLabel htmlFor='filled-adornment-password'>
						Password
					</InputLabel>
					<FilledInput
						id='filled-adornment-password'
						type={state.showPassword ? "text" : "password"}
						value={state.password}
						onChange={(e) =>
							handleStateChange("password", e.target.value)
						}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									onClick={() => handleClickShowPassword()}
									// onMouseDown={() => handleMouseDownPassword()}
									edge='end'
									size='small'>
									{state.showPassword ? (
										<VisibilityOff />
									) : (
										<Visibility />
									)}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				{state.isNewUser && (
					<FormControl sx={{ m: 1, width: "35ch" }} variant='filled'>
						<InputLabel htmlFor='filled-adornment-confirm-password'>
							Confirm Password
						</InputLabel>
						<FilledInput
							id='filled-adornment-confirm-password'
							type={state.showCPassword ? "text" : "password"}
							value={state.confirmPassword}
							onChange={(e) =>
								handleStateChange(
									"confirmPassword",
									e.target.value
								)
							}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={() =>
											handleClickShowPassword(true)
										}
										// onMouseDown={() => handleMouseDownPassword(true)}
										edge='end'
										size='small'>
										{state.showCPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
				)}
				<Button
					sx={{ m: 1, width: "max-width" }}
					variant='contained'
					endIcon={<ChevronRightIcon />}
					onClick={() => handlePrimaryAction()}>
					{state.isNewUser ? "Signup" : "Login"}
				</Button>
				<Button
					sx={{ m: 1, width: "max-width" }}
					variant='outlined'
					onClick={() => handleSignupToggle()}>
					{state.isNewUser ? "Already signed up ?" : "New user ?"}
				</Button>
			</div>
		</div>
	);
}
