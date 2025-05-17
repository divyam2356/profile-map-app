'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

export default function ProfileDetailMap({ profile }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Check if we're running on the client side
    if (typeof window === 'undefined' || !profile.location) return;

    // Import Leaflet dynamically since it's a client-side library
    const L = require('leaflet');
    
    // Fix marker icon issues
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Only initialize the map if it hasn't been initialized yet
    if (!mapInstanceRef.current && mapRef.current) {
      // Set view to profile location
      const map = L.map(mapRef.current, {
        center: [profile.location.lat, profile.location.lng],
        zoom: 12,
        scrollWheelZoom: true,
        minZoom: 3,
        maxZoom: 18
      });
      
      // Add the OpenStreetMap tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      
      // Add marker for the profile
      const marker = L.marker([profile.location.lat, profile.location.lng]).addTo(map);
      
      // Bind popup to marker with profile name and address
      marker.bindPopup(`
        <div style="text-align:center; padding: 4px;">
          <h3 style="font-weight:bold; color:#2563eb; margin-bottom:4px;">${profile.name}</h3>
          <p style="color:#4b5563; margin:0;">${profile.address}</p>
        </div>
      `).openPopup();
      
      // Force a resize after initialization to ensure proper rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
      // Store the map instance
      mapInstanceRef.current = map;
      
      // Add a resize handler
      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [profile]);

  return (
    <div 
      className="w-full h-[300px] md:h-[350px] bg-muted rounded-md flex items-center justify-center overflow-hidden"
      style={{ border: '1px solid #e5e7eb' }}
    >
      <div id="profile-map" ref={mapRef} className="w-full h-full" />
    </div>
  );
}
