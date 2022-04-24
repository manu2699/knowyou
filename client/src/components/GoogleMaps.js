// import "./styles.css";
import React, { useEffect, useState, useRef } from "react";

import { Wrapper } from "@googlemaps/react-wrapper";

const IMAGES = [
	"https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png",
	"https://www.shareicon.net/data/128x128/2016/05/24/769971_man_512x512.png",
	"https://www.shareicon.net/data/128x128/2015/09/24/106432_user_512x512.png"
];

const Map = ({ onClick, onIdle, children, style, ...options }) => {
	const ref = useRef(null);
	const [map, setMap] = useState();

	useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, {}));
		}
	}, [ref, map]);

	useEffect(() => {
		if (map) {
			map.setOptions(options);
		}
	}, [map, options]);

	useEffect(() => {
		if (map) {
			["click", "idle"].forEach((eventName) =>
				window.google.maps.event.clearListeners(map, eventName)
			);

			if (onClick) {
				map.addListener("click", onClick);
			}

			if (onIdle) {
				map.addListener("idle", () => onIdle(map));
			}
		}
	}, [map, onClick, onIdle]);

	return (
		<>
			<div ref={ref} style={style} />
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, { map });
				}
			})}
		</>
	);
};

const Marker = (options) => {
	const [marker, setMarker] = useState();
	// const contentRef = useRef(null);

	useEffect(() => {
		if (!marker) {
			setMarker(new window.google.maps.Marker());
		}

		return () => {
			if (marker) {
				marker.setMap(null);
			}
		};
	}, [marker]);

	useEffect(() => {
		if (marker) {
			const infowindow = new window.google.maps.InfoWindow({
				content: options.content
			});
			console.log(options);
			marker.setOptions({
				...options,
				icon: {
					...options.icon,
					scaledSize: new window.google.maps.Size(32, 32)
				}
			});

			marker.addListener("click", () => {
				infowindow.open({
					anchor: marker,
					shouldFocus: false
				});
			});
		}
	}, [marker, options]);

	return null;
};

export function MapView({ location, markers = [], referenceKey }) {
	const [currLoc, setCurrLoc] = useState(location);

	useEffect(() => {
		if (!location?.lat && !location?.lng) {
			navigator.geolocation.getCurrentPosition((position) => {
				setCurrLoc({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
			});
		} else if (location.lat && location.lng) {
			setCurrLoc(location);
		}
	}, [location]);

	return (
		<div style={{ display: "flex", height: "450px", width: "100%" }}>
			<Wrapper apiKey={"AIzaSyCOyQqkB7Wr01FK5Vl3VrpiA4nJDyKrB_c"}>
				<Map
					center={currLoc}
					zoom={15}
					style={{ flexGrow: "1", height: "100%" }}>
					{markers.length > 0 &&
						markers.map((marker, index) => {
							console.log("Maker", marker, index);
							return (
								<Marker
									position={{
										lat: marker.atLocation.latitute,
										lng: marker.atLocation.longitude
									}}
									content={marker[referenceKey]?.name}
									icon={{
										url: IMAGES[index % 3]
									}}
								/>
							);
						})}
				</Map>
			</Wrapper>
		</div>
	);
}
