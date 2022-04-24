import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";

import doRequest from "../utils/requestHooks";
import PersonCard from "./../components/PersonCard";
import { MapView } from "../components/GoogleMaps";

import styles from "./styles.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function KnownYouList() {
	const navigate = useNavigate();
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			user: {},
			knownYou: [],
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
				getKnowMeUsers(data._id);
			},
			onError: (err) => {}
		});
	}

	function getKnowMeUsers(userId) {
		doRequest({
			url: `/api/knows/knowsme/${userId}`,
			method: "get",
			onSuccess: (data) => {
				setState({ knownYou: data });
			},
			onError: (err) => {}
		});
	}

	return (
		<div className={styles.mainPage}>
			<div className={styles.listConatiner}>
				<div className={styles.headerContainer}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon
							sx={{ fontSize: 20, color: "#004458" }}
						/>
					</IconButton>
					<h3>Know you</h3>
				</div>

				<span className={styles.subdueFont}>
					Full Map view
					<IconButton
						onClick={() => setState({ isFullMapView: true })}>
						<ChevronRightIcon
							sx={{ fontSize: 18, color: "#004458" }}
						/>
					</IconButton>
				</span>

				<div className={styles.listContainer}>
					{state.knownYou.length > 0 &&
						state.knownYou.map((knownMember) => (
							<PersonCard
								details={knownMember}
								displayKey={"knownBy"}
								onLocationClick={() => {
									setState({ selectedPerson: knownMember });
								}}
							/>
						))}
				</div>
				{state.selectedPerson?.knownBy?.name && (
					<div className={`${styles.popupOverlay}`}>
						<div
							className={`${styles.popupContainer} ${styles.mapPopup}`}>
							<div className={styles.spacedRow}>
								<div className={styles.strongFont}>
									{state.selectedPerson?.knownBy?.name} met
									you at
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
								<MapView
									referenceKey={"knownBy"}
									location={{
										lat: state.selectedPerson.atLocation
											.latitute,
										lng: state.selectedPerson.atLocation
											.longitude
									}}
									markers={[
										{
											atLocation: {
												latitute:
													state.selectedPerson
														.atLocation.latitute,
												longitude:
													state.selectedPerson
														.atLocation.longitude
											},
											knownBy: {
												name: state.selectedPerson
													.knownBy.name
											}
										}
									]}
								/>
							) : (
								<p>No location details found...</p>
							)}
						</div>
					</div>
				)}

				{state.isFullMapView && (
					<div className={`${styles.popupOverlay}`}>
						<div
							className={`${styles.popupContainer} ${styles.mapPopup}`}>
							<div className={styles.spacedRow}>
								<div className={styles.strongFont}>
									View all people who know you
								</div>
								<IconButton
									onClick={() =>
										setState({ isFullMapView: false })
									}>
									<CloseIcon
										sx={{ fontSize: 20, color: "#004458" }}
									/>
								</IconButton>
							</div>
							<MapView
								referenceKey={"knownBy"}
								markers={[...state.knownYou]}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
