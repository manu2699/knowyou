import React from "react";

import IconButton from "@mui/material/IconButton";
import dateUtil from "./../utils/dateFormat";

import styles from "./styles.module.css";

import FmdGoodIcon from "@mui/icons-material/FmdGood";

export default function PersonCard({ details, onLocationClick }) {
	return (
		<div className={styles.cardItem}>
			<div className={styles.personIcon}>
				<IconButton onClick={onLocationClick}>
					<FmdGoodIcon sx={{ fontSize: 40, color: "#004458" }} />
				</IconButton>
			</div>
			<h4>{details?.user?.name}</h4>
			<h5>{details?.user?.email}</h5>
			<span>on {dateUtil(details?.atTime)}</span>
		</div>
	);
}
