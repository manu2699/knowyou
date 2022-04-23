import React, { useEffect, useReducer } from "react";

import { QRCodeSVG } from "qrcode.react";
import jsQR from "jsqr";

import Button from "@mui/material/Button";

import doRequest from "./../utils/requestHooks";


import styles from "./styles.module.css";

// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function MainPage() {
	const [state, setState] = useReducer(
		(oldState, newState) => ({ ...oldState, ...newState }),
		{
			user: {},
			isScanMode: false,
			location: {},
			scannedUser: undefined
		}
	);

	let videoRef = React.useRef(null);
	// const [scannedUser, setScannedUser] = React.useState(null);

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
				// setState({ user: data });
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

	function handleQRScan(result, error) {
		if (!!result) {
			alert(result?.text);
			if (result?.text) {
				findUser(result?.text);
			}
		}
		if (!!error) {
			console.info(error);
		}
	}

	function onScanStart() {
		setState({ isScanMode: true });
		videoStreamTest();
		// jsQRUtil(document);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				let location = {
					latitute: position.coords.latitude,
					longitude: position.coords.longitude
				};
				setState({ location });
			});
		}
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
				setState({ scannedUser: undefined });
			},
			onError: (err) => {}
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
				alert(code.data);
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

	return (
		<div className={styles.mainPage}>
			<div className={styles.userContainer}>
				<h3>Welcome {state.user?.name}</h3>
				<h5>{state.user?.email}</h5>
				<div className={styles.userStats}>
					<div className={styles.statCard}>
						<h5>You know</h5>
						<span>
							<span className={styles.statCount}>100</span>{" "}
							peoples
						</span>
					</div>
					<div className={styles.statCard}>
						<h5>Known you</h5>
						<span>
							by <span className={styles.statCount}>100</span>{" "}
							peoples
						</span>
					</div>
				</div>
				<div className={styles.qrCodeContainer}>
					<QRCodeSVG
						value={state.user?._id}
						bgColor='#d9f0f7'
						fgColor='#004458'
						size={250}
					/>
				</div>
				<Button
					sx={{ m: 1, width: "max-width" }}
					variant='contained'
					// endIcon={<ChevronRightIcon />}
					onClick={() => onScanStart()}>
					Add knowns
				</Button>

				{state.isScanMode && (
					<div className={styles.qrScannerOverlay}>
						<div className={styles.qrScanerContainer}>
							<div className={styles.qrScannerCam}>
								<video
									ref={videoRef}
									id='scanner'
									muted
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
					<div className={styles.qrScannerOverlay}>
						<div className={styles.qrScanerContainer2}>
							<h4>Know {state.scannedUser?.name}</h4>
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
						s
					</div>
				)}
			</div>
		</div>
	);
}
