import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const VaccineMap = ({ center, markers, onSelectCenter }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([10.762622, 106.660172], 13); // Default to Ho Chi Minh City coordinates

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Create clinic icon
    const clinicIcon = L.divIcon({
      html: '<i class="fas fa-clinic-medical text-blue-600 text-2xl"></i>',
      iconSize: [24, 24],
      className: 'custom-div-icon'
    });

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add new markers
    if (markers && markers.length > 0) {
      markers.forEach((marker) => {
        const { lat, lng, name, address } = marker;
        L.marker([lat, lng], { icon: clinicIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div class="text-sm">
              <strong>${name}</strong><br/>
              ${address}
            </div>
          `)
          .on('click', () => onSelectCenter && onSelectCenter(marker));
      });

      // Center map on first marker if no center specified
      if (!center && markers.length > 0) {
        mapInstanceRef.current.setView([markers[0].lat, markers[0].lng], 13);
      }
    }

    // Update center if provided
    if (center) {
      mapInstanceRef.current.setView([center.lat, center.lng], 13);
    }

    return () => {
      // Cleanup on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, markers, onSelectCenter]);

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full rounded-lg shadow-sm"
      style={{ zIndex: 1 }}
    />
  );
};

export default VaccineMap; 