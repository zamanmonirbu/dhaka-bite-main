"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix default icon issues in Leaflet + React
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const LocationPicker = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const LocationPickerMap = ({
  onMapClick,
  selectedPosition,
}: {
  onMapClick: (lat: number, lng: number) => void
  selectedPosition: { lat: number; lng: number } | null
}) => {
  const defaultPosition: LatLngExpression = [23.8103, 90.4125] // Dhaka

  return (
    <MapContainer
      center={selectedPosition || defaultPosition}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full z-0"
      key={selectedPosition ? `${selectedPosition.lat}-${selectedPosition.lng}` : "default"}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationPicker onMapClick={onMapClick} />
      {selectedPosition && <Marker position={[selectedPosition.lat, selectedPosition.lng]} />}
    </MapContainer>
  )
}

export default LocationPickerMap
