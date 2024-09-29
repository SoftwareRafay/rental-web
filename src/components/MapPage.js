import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define custom icon
const customIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
	shadowSize: [41, 41],
});

// Replace with your OpenCage API key
const OPENCAGE_API_KEY = "dba5a6c69c204c15a6009781837926da";

function MapPage() {
	const [listings, setListings] = useState([]);
	const [center, setCenter] = useState(null); // Center is initially null
	const [noProperties, setNoProperties] = useState(false); // To handle no properties case
	const [coordinates, setCoordinates] = useState([]); // To store geocoded coordinates
	const location = useLocation();

	// Helper function to get query parameter values
	const getQueryParams = (search) => {
		return new URLSearchParams(search);
	};

	// Function to fetch city coordinates using OpenCage Geocoding API
	const fetchCityCoordinates = async (city) => {
		try {
			const response = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json`,
				{
					params: {
						q: city,
						key: OPENCAGE_API_KEY,
						limit: 1,
					},
				}
			);

			if (response.data.results.length > 0) {
				const { lat, lng } = response.data.results[0].geometry;
				setCenter([lat, lng]); // Center map to city location
			} else {
				console.error("City not found in OpenCage Geocoding API.");
			}
		} catch (error) {
			console.error("Error fetching city coordinates:", error);
		}
	};

	// Function to geocode an address using OpenCage Geocoding API
	const geocodeAddress = async (address) => {
		try {
			const response = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json`,
				{
					params: {
						q: address,
						key: OPENCAGE_API_KEY,
						limit: 1,
					},
				}
			);

			if (response.data.results.length > 0) {
				const { lat, lng } = response.data.results[0].geometry;
				return [lat, lng];
			} else {
				console.error("Address not found in OpenCage Geocoding API.");
				return null;
			}
		} catch (error) {
			console.error("Error fetching address coordinates:", error);
			return null;
		}
	};

	useEffect(() => {
		const params = getQueryParams(location.search);
		const city = params.get("city");

		if (city) {
			const fetchListings = async () => {
				try {
					const response = await axios.get(
						`http://localhost:5000/api/listings`,
						{
							params: { city },
						}
					);
					const listingData = response.data;
					setListings(listingData);

					if (listingData.length > 0) {
						await fetchCityCoordinates(city);

						// Geocode each address and store coordinates
						const coordsPromises = listingData.map((property) =>
							geocodeAddress(property.address)
						);
						const coords = await Promise.all(coordsPromises);
						setCoordinates(coords.filter((coord) => coord !== null));
						setNoProperties(false); // Listings found, so no "no properties" message
					} else {
						// No listings found, fetch the city's coordinates to center the map
						await fetchCityCoordinates(city);
						setNoProperties(true); // No listings found
					}
				} catch (error) {
					console.error("Error fetching listing data:", error);
				}
			};

			fetchListings();
		}
	}, [location.search]);

	return (
		<div>
			<h1>Rental Properties Map</h1>
			{center ? (
				<MapContainer
					center={center}
					zoom={12}
					style={{ height: "400px", width: "100%" }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{coordinates.length > 0
						? coordinates.map((coord, index) => (
								<Marker key={index} position={coord} icon={customIcon}>
									<Popup>
										<div>
											<p>{listings[index]?.name || "No name available"}</p>
											<a href={`/rental/${listings[index]?.id}`}>
												View Details
											</a>
										</div>
									</Popup>
								</Marker>
						  ))
						: noProperties && (
								<></> // Do not render a marker if no properties are available
						  )}
				</MapContainer>
			) : (
				<p>Loading map...</p> // Display a loading message or spinner until the center is set
			)}
			{noProperties && <p>No properties available in this city.</p>}
		</div>
	);
}

export default MapPage;
