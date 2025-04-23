import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ allStories, setOpenViewModal }) => {
    // Calculate center based on available locations
    const calculateCenter = () => {
        const validLocations = allStories.flatMap(story => 
            story.visitedLocation.filter(loc => loc.latitude && loc.longitude)
        );

        if (validLocations.length === 0) return [51.505, -0.09]; // Default center

        const avgLat = validLocations.reduce((sum, loc) => sum + loc.latitude, 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, loc) => sum + loc.longitude, 0) / validLocations.length;

        return [avgLat, avgLng];
    };

    return (
        <div className="absolute top-[70px] left-0 right-0 bottom-0 z-[10]">
            <MapContainer 
                center={calculateCenter()} 
                zoom={5} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {allStories.map((story) =>
                    story.visitedLocation
                        .filter(location => location && location.latitude && location.longitude)
                        .map((location, index) => (
                            <Marker
                                key={`${story._id}-${index}`}
                                position={[location.latitude, location.longitude]}
                                eventHandlers={{
                                    click: () => setOpenViewModal({ isShown: true, data: story }),
                                }}
                            >
                                <Popup>
                                    <b>{story.title}</b>
                                    <p>{location.location}</p>
                                </Popup>
                            </Marker>
                        ))
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;