import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { QRCodeSVG } from "qrcode.react";
// import jsQR from "jsqr";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import doRequest from "../utils/requestHooks";

import styles from "./styles.module.css";

// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function KnowMePage() {
  const navigate = useNavigate();
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			user: {},
		}
	);

	useEffect(function onLoad() {
		getUser("", (data) => {
			setState({ user: data });
		});
	}, []);

  	async function getUser(userId = "", callBack) {
		await doRequest({
			url: `/api/user/${userId}`,
			method: "get",
			onSuccess: (data) => {
				callBack && callBack(data);
			},
			onError: (err) => {}
		});
	}
  return (
		<div className={styles.mainPage}>
			<div className={styles.userContainer}>
				<div className={styles.headerContainer}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon
							sx={{ fontSize: 20, color: "#004458" }}
						/>
					</IconButton>
					<h3>Know me</h3>
				</div>
				<div className={styles.qrCodeContainer}>
					<QRCodeSVG
						value={state.user?._id}
						fgColor='#004458'
						size={350}
					/>
				</div>
				<h5>Show this QR code to someone who wish to know you...</h5>
			</div>
		</div>
  );
}