"use client"

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin } from "lucide-react"
import ReactDOMServer from "react-dom/server"

interface Location {
  _id: string
  areaName: string
  latitude: number
  longitude: number
  radius: number
}

interface MapWithNoSSRProps {
  locations: Location[]
}

const createLucideIcon = () =>
  L.divIcon({
    html: ReactDOMServer.renderToString(
      <MapPin size={24} color="#ef4444" className="drop-shadow-md" />
    ),
    iconSize: [24, 24],
    className: "custom-div-icon",
  })

export default function MapWithNoSSR({ locations }: MapWithNoSSRProps) {
  const center = locations.length
    ? { lat: locations[0].latitude, lng: locations[0].longitude }
    : { lat: 23.8103, lng: 90.4125 }

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {locations.map((loc) => (
        <Marker
          key={loc._id}
          position={[loc.latitude, loc.longitude]}
          icon={createLucideIcon()}
        >
          <Popup>{loc.areaName}</Popup>
          <Circle
            center={[loc.latitude, loc.longitude]}
            radius={loc.radius}
            pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.2 }}
          />
        </Marker>
      ))}
    </MapContainer>
  )
}
