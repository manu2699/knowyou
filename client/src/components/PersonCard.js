import React  from "react";

import IconButton from "@mui/material/IconButton";
import dateUtil from "./../utils/dateFormat";

import styles from "./styles.module.css";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export default function PersonCard({ details }) {
	return (
		<div className={styles.cardItem}>
			<div className={styles.personIcon}>
				<IconButton>
					<PersonOutlineIcon
						sx={{ fontSize: 60, color: "#004458" }}
					/>
				</IconButton>
			</div>
			<h4>{details?.user?.name}</h4>
			<h5>{details?.user?.email}</h5>
			<span>on {dateUtil(details?.atTime)}</span>
		</div>
	);
}
