import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";

import doRequest from "../utils/requestHooks";
import PersonCard from "./../components/PersonCard";

import styles from "./styles.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function YowKnowList() {
	const navigate = useNavigate();
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			user: {},
			youKnow: []
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
				getKnownUsers(data._id);
			},
			onError: (err) => {}
		});
	}

	function getKnownUsers(userId) {
		doRequest({
			url: `/api/knows/iknow/${userId}`,
			method: "get",
			onSuccess: (data) => {
				setState({ youKnow: data });
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
					<h3>Know you</h3>
				</div>
				<div className={styles.listContainer}>
					{state.youKnow.length > 0 &&
						state.youKnow.map((knownMember) => (
							<PersonCard details={knownMember} />
						))}
				</div>
			</div>
		</div>
	);
}
