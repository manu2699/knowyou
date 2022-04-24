import React, { useEffect, useRef, useState } from "react";

import IconButton from "@mui/material/IconButton";
import mapboxgl from "mapbox-gl";

import styles from "./styles.module.css";

import FmdGoodIcon from "@mui/icons-material/FmdGood";

mapboxgl.accessToken =
	"pk.eyJ1IjoibWFudXZrIiwiYSI6ImNsMmN3aTd1cjB0ZmUza3A5cHprMjc2ZXEifQ.A6n1rDaPfLEOjRYANQ78pQ";

export function SingleMapView({ details }) {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [zoom, setZoom] = useState(15);

	//center: [details.longitude, details.latitute], // starting position [lng, lat]

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [details.longitude, details.latitute], // starting position [lng, lat]
			zoom: zoom
		});
		const el = document.getElementById("marker");
		
		// make a marker for each feature and add it to the map
		new mapboxgl.Marker(el)
			.setLngLat([details.longitude, details.latitute])
			.addTo(map.current);
	});

	useEffect(() => {
		if (!map.current) return; 
		map.current.on("move", () => {
			setZoom(map.current.getZoom().toFixed(2));
		});
	});

	return (
		<React.Fragment>
			<div ref={mapContainer} className={styles.mapContainer} />
			<div id='marker'>
				<IconButton>
					<FmdGoodIcon
						sx={{ fontSize: 2 * zoom, color: "#004458" }}
					/>
				</IconButton>
			</div>
		</React.Fragment>
	);
}

export function MapView({ details }) {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [zoom, setZoom] = useState(15);

	//center: [details.longitude, details.latitute], // starting position [lng, lat]

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [details.longitude, details.latitute], // starting position [lng, lat]
			zoom: zoom
		});
		const el = document.getElementById("marker");

		// make a marker for each feature and add it to the map
		new mapboxgl.Marker(el)
			.setLngLat([details.longitude, details.latitute])
			.addTo(map.current);
	});

	useEffect(() => {
		if (!map.current) return;
		map.current.on("move", () => {
			setZoom(map.current.getZoom().toFixed(2));
		});
	});

	return (
		<React.Fragment>
			<div ref={mapContainer} className={styles.mapContainer} />
			<div id='marker'>
				<IconButton>
					<FmdGoodIcon
						sx={{ fontSize: 2 * zoom, color: "#004458" }}
					/>
				</IconButton>
			</div>
		</React.Fragment>
	);
}
