import React, { useEffect, useReducer } from "react";

import { QRCodeSVG } from "qrcode.react";
import QrReader from "react-qr-scanner";
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
			location: {}
		}
	);

	useEffect(function onLoad() {
		getUser();
	}, []);

	async function getUser() {
		await doRequest({
			url: `/api/user/`,
			method: "get",
			onSuccess: (data) => {
				setState({ user: data });
			},
			onError: (err) => {}
		});
	}

	function handleQRScan(data) {
		console.log(data);
	}

	function handleQRScanError(err) {
		console.error(err);
	}

	function onScanStart() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				let location = {
					latitute: position.coords.latitude,
					longitude: position.coords.longitude
				}
				setState({ location });
			});
		}
		setState({ isScanMode: true });
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
							<QrReader
								delay={100}
								onError={handleQRScanError}
								onScan={handleQRScan}
								facingMode={"rear"}
							/>
							<div className={styles.qrActions}>
								<Button
									sx={{ m: 1, width: "max-width" }}
									variant='contained'
									// endIcon={<ChevronRightIcon />}
									onClick={() =>
										setState({ isScanMode: false })
									}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
