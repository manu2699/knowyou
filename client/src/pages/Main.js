import React, { useEffect, useReducer } from "react";

import { QRCodeSVG } from "qrcode.react";
import { QrReader } from "react-qr-reader";
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

	const [selfie, setIsSelfie] = React.useState(false);
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
				alert(`Added ${state.scannedUser.name} to your list of known people`);
				setState({ scannedUser: undefined });
			},
			onError: (err) => {}
		});
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
								<QrReader
									key={
										state.selfie ? "selfie" : "environment"
									}
									onResult={(result, error) =>
										handleQRScan(result, error)
									}
									constraints={{
										video: {
											facingMode: {
												exact: selfie
													? "environment"
													: "face"
											}
										}
									}}
									style={{ width: "100%" }}
								/>
							</div>
							<div className={styles.qrActions}>
								<Button
									sx={{ m: 1, width: "max-width" }}
									variant='outlined'
									onClick={() => setIsSelfie(!selfie)}>
									Switch Camera
								</Button>
								<Button
									sx={{ m: 1, width: "max-width" }}
									variant='contained'
									onClick={() =>
										setState({ isScanMode: false })
									}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				)}
				{state.scannedUser?.name && state.isScanMode === false && (
					<div className={styles.qrScannerOverlay}>
						<div className={styles.qrScanerContainer}>
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
						</div>s
					</div>
				)}
			</div>
		</div>
	);
}
