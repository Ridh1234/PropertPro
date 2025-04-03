import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function PropertyMap({ latitude, longitude, title, address }: PropertyMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      className="w-full h-[400px] rounded-lg overflow-hidden shadow-md"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        <Popup>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
