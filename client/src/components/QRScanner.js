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
			isScanMode: false
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
			onError: (err) => {
				// if (typeof err === "object")
				// alert(err[0].msg);
				// else alert(err);
			}
		});
	}

	function onQrCodeScanned(data) {
		setState({ isScanMode: false });
	}

	function onQrCodeScanStart() {
		setState({ isScanMode: true });
	}

	function handleQRScan(data) {}

	function handleQRScanError(err) {
		console.error(err);
	}

	return (
		<div className={styles.mainPage}>
			<QrReader
				// style={previewStyle}
				onError={handleQRScanError}
				onScan={handleQRScan}
				facingMode={"rear"}
			/>
		</div>
	);
}
