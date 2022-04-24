import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";

import doRequest from "../utils/requestHooks";
import PersonCard from "./../components/PersonCard";
import { SingleMapView } from "../components/ViewOnMap";

import styles from "./styles.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

export default function YowKnowList() {
	const navigate = useNavigate();
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			user: {},
			youKnow: [],
			selectedPerson: undefined
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
							<PersonCard
								details={knownMember}
								displayKey={"user"}
								onLocationClick={() =>
									setState({ selectedPerson: knownMember })
								}
							/>
						))}
				</div>
				{state.selectedPerson?.user?.name && (
					<div className={`${styles.popupOverlay}`}>
						<div
							className={`${styles.popupContainer} ${styles.mapPopup}`}>
							<div className={styles.spacedRow}>
								<div className={styles.strongFont}>
									You met{" "}
									{state.selectedPerson?.knownBy?.name} at
								</div>
								<IconButton
									onClick={() =>
										setState({ selectedPerson: undefined })
									}>
									<CloseIcon
										sx={{ fontSize: 20, color: "#004458" }}
									/>
								</IconButton>
							</div>
							{state.selectedPerson?.atLocation?.longitude &&
							state.selectedPerson?.atLocation?.latitute ? (
								<SingleMapView
									details={state.selectedPerson.atLocation}
								/>
							) : (
								<p>No location details found...</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
