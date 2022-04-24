import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

// import { QRCodeSVG } from "qrcode.react";
import jsQR from "jsqr";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { MapView } from "../components/GoogleMaps";

import doRequest from "./../utils/requestHooks";

import styles from "./styles.module.css";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

export default function MainPage() {
	const navigate = useNavigate();
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			user: {},
			isScanMode: false,
			location: {},
			scannedUser: undefined,
			knownYou: [],
			youKnow: [],
			selectedCategory: undefined
		}
	);

	let videoRef = React.useRef(null);
	// const [scannedUser, setScannedUser] = React.useState(null);

	useEffect(function onLoad() {
		getUser("", (data) => {
			setState({ user: data });
			getUserStats(data._id);
		});
	}, []);

	function getUserStats(userId) {
		doRequest({
			url: `/api/knows/knowsme/${userId}`,
			method: "get",
			onSuccess: (data) => {
				setState({ knownYou: data });
			},
			onError: (err) => {}
		});
		doRequest({
			url: `/api/knows/iknow/${userId}`,
			method: "get",
			onSuccess: (data) => {
				setState({ youKnow: data });
			},
			onError: (err) => {}
		});
	}

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

	function findUser(scannedUserID) {
		getUser(scannedUserID, (data) => {
			setState({ scannedUser: data, isScanMode: false });
		});
	}

	function onScanStart() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				let location = {
					latitute: position.coords.latitude,
					longitude: position.coords.longitude
				};
				setState({ location });
			});
		}
		setState({ isScanMode: true });
		videoStreamTest();
	}

	function onScannedCancel() {
		setState({
			scannedUser: undefined
		});
	}
	async function onScannedProceed() {
		await doRequest({
			url: `/api/knows/`,
			method: "post",
			body: {
				knownBy: state.user._id,
				user: state.scannedUser._id,
				atLocation: state.location
			},
			onSuccess: (data) => {
				alert(
					`Added ${state.scannedUser.name} to your list of known people`
				);
				getUserStats(state.user._id);
				setState({ scannedUser: undefined });
			},
			onError: (err) => {
				if (typeof err === "object") alert(err[0].msg);
				else if (err) alert(err);
				setState({ scannedUser: undefined });
			}
		});
	}

	function videoStreamTest() {
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: {
					facingMode: "environment"
				}
			})
			.then((mediaStream) => {
				console.log("on video", mediaStream);
				videoRef.current.srcObject = mediaStream;
				videoRef.current.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
				videoRef.current.play();
				requestAnimationFrame(() => {
					onVideoStream(mediaStream, videoRef.current);
				});
			});
	}

	async function onVideoStream(stream, video) {
		// console.log("video ready ", video.readyState);
		if (stream) {
			const videoTracks = await stream.getVideoTracks();
			const videoTrackSettings = videoTracks[0].getSettings();

			const canvasElement = document.createElement("canvas");
			canvasElement.height = videoTrackSettings.height;
			canvasElement.width = videoTrackSettings.width;

			const canvasCtx = canvasElement.getContext("2d");
			canvasCtx.drawImage(
				video,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);
			var imageData = canvasCtx.getImageData(
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);
			var code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: "dontInvert"
			});
			// const code = jsQR(stream, 400, 400);
			if (code?.data) {
				console.log("Found QR code", code);
				findUser(code.data);
				closeStream();
			}
			requestAnimationFrame(() => {
				onVideoStream(stream, video);
			});
		}
	}

	function closeStream() {
		const stream = videoRef.current.srcObject;
		const tracks = stream.getTracks();

		tracks.forEach(function (track) {
			track.stop();
		});

		videoRef.current = undefined;
		setState({ isScanMode: false });
	}

	function handleLogout() {
		localStorage.removeItem("token");
		localStorage.removeItem("id");
		window.location.reload();
	}

	return (
		<div className={styles.mainPage}>
			<div className={styles.userContainer}>
				<div className={styles.userCard}>
					<IconButton>
						<AccountCircleIcon
							sx={{ fontSize: 100, color: "#004458" }}
						/>
					</IconButton>
					<div
						className={styles.logout}
						onClick={() => handleLogout()}>
						<IconButton>
							<LogoutIcon
								sx={{ fontSize: 20, color: "#004458" }}
							/>
						</IconButton>
					</div>
					<h3>{state.user?.name}</h3>
					<h5>{state.user?.email}</h5>
				</div>
				<div className={styles.userStats}>
					<div className={styles.statCard}>
						<h3>{state.youKnow?.length || 0}</h3>
						<span className={styles.subdueFont}>
							You know
							<IconButton onClick={() => navigate("/iknowyou")}>
								<ChevronRightIcon
									sx={{ fontSize: 18, color: "#004458" }}
								/>
							</IconButton>
						</span>
					</div>
					<div className={styles.statCard}>
						<h3>{state.knownYou?.length || 0}</h3>
						<span className={styles.subdueFont}>
							Known you
							<IconButton
								onClick={() => navigate("/knowyoulist")}>
								<ChevronRightIcon
									sx={{ fontSize: 18, color: "#004458" }}
								/>
							</IconButton>
						</span>
					</div>
				</div>

				<div className={styles.centerColumn}>
					<p className={styles.subdueFont2}>Someone wants to </p>
					<Button
						sx={{
							m: 1,
							width: "90%",
							color: "#004458",
							borderRadius: "20px",
							p: 1,
							background:
								"linear-gradient(120deg, #fff, #d9f0f7, #fff)"
						}}
						variant='contained'
						// endIcon={<ChevronRightIcon />}
						onClick={() => navigate("/knowme")}>
						Know Me
					</Button>
				</div>

				<div className={styles.centerColumn}>
					<p className={styles.subdueFont2}>I want to </p>
					<Button
						sx={{
							m: 1,
							width: "90%",
							color: "#004458",
							borderRadius: "20px",
							p: 1,
							background:
								"linear-gradient(120deg, #fff, #d9f0f7, #fff)"
						}}
						variant='contained'
						// endIcon={<ChevronRightIcon />}
						onClick={() => onScanStart()}>
						Know Someone
					</Button>
				</div>

				<div className={styles.centerColumn}>
					<p className={styles.subdueFont2}>View </p>
					<Button
						sx={{
							m: 1,
							width: "90%",
							color: "#004458",
							borderRadius: "20px",
							p: 1,
							background:
								"linear-gradient(120deg, #fff, #d9f0f7, #fff)"
						}}
						variant='contained'
						// endIcon={<ChevronRightIcon />}
						onClick={() => {
							setState({
								selectedCategory: "youKnow"
							});
						}}>
						Your Map
					</Button>
				</div>

				{state.isScanMode && (
					<div className={styles.qrScannerOverlay}>
						<div className={styles.qrScanerContainer}>
							<div className={styles.qrScannerCam}>
								<video
									ref={videoRef}
									id='scanner'
									muted
									className={styles.qrScannerCam}
									autoPlay></video>
							</div>
							<div className={styles.qrActions}>
								<Button
									sx={{ m: 1, width: "max-width" }}
									variant='contained'
									onClick={() => closeStream()}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				)}

				{state.scannedUser?.name && state.isScanMode === false && (
					<div className={styles.popupOverlay}>
						<div className={styles.popupContainer}>
							<h4>Know {state.scannedUser?.name}</h4>
							<h5>{state.scannedUser?.email}</h5>
							<div className={styles.centerRow}>
								<Button
									sx={{ m: 1, width: "max-width" }}
									variant='outlined'
									onClick={() => onScannedCancel()}>
									Cancel
								</Button>
								<Button
									sx={{ m: 1, width: "max-width" }}
									variant='contained'
									onClick={() => onScannedProceed()}>
									Continue
								</Button>
							</div>
						</div>
					</div>
				)}

				{state.selectedCategory && (
					<div className={`${styles.popupOverlay}`}>
						<div
							className={`${styles.popupContainer} ${styles.mapPopup}`}>
							<div className={styles.spacedRow}>
								<ToggleButtonGroup
									exclusive
									value={state.selectedCategory}
									onChange={(e) =>
										setState({
											selectedCategory: e.target.value
										})
									}>
									<ToggleButton value='youKnow'>
										You know
									</ToggleButton>
									<ToggleButton value='knownYou'>
										Know you
									</ToggleButton>
								</ToggleButtonGroup>
								<IconButton
									onClick={() =>
										setState({
											selectedCategory: undefined
										})
									}>
									<CloseIcon
										sx={{ fontSize: 20, color: "#004458" }}
									/>
								</IconButton>
							</div>
							<MapView
								referenceKey={
									state.selectedCategory === "knownYou"
										? "knownBy"
										: "user"
								}
								markers={[...state[state.selectedCategory]]}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
