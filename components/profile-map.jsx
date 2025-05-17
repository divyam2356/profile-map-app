'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { useProfiles } from './profile-provider';
import { useRouter } from 'next/navigation';

export default function ProfileMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const router = useRouter();
  const { profiles, selectedProfileId, setSelectedProfileId } = useProfiles();

  useEffect(() => {
    // Check if we're running on the client side
    if (typeof window === 'undefined') return;

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
      // Set default view to United States with specific dimensions for proper rendering
      const map = L.map(mapRef.current, {
        center: [39.8283, -98.5795],
        zoom: 4,
        scrollWheelZoom: true, // Enable scroll wheel zoom
        minZoom: 3, // Restrict how far users can zoom out
        maxZoom: 18, // Restrict maximum zoom in
        maxBounds: [[-90, -180], [90, 180]], // Restrict panning to world bounds
        maxBoundsViscosity: 0.8 // Makes the bounds "sticky" but still allows some movement
      });
      
      // Add the OpenStreetMap tile layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        noWrap: true // Prevents the map from repeating across the x-axis
      }).addTo(map);
      
      // Add a world boundary to prevent panning to empty areas
      const worldBounds = L.latLngBounds(
        L.latLng(-90, -180), // Southwest corner
        L.latLng(90, 180)    // Northeast corner
      );
      
      // Add an event listener to keep the view within world bounds
      map.on('drag', function() {
        map.panInsideBounds(worldBounds, { animate: false });
      });
      
      // Force a resize after initialization to ensure proper rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
      // Store the map instance
      mapInstanceRef.current = map;
    }

    // Add markers for all profiles
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      
      // Clear any existing markers
      Object.values(markersRef.current).forEach(marker => {
        map.removeLayer(marker);
      });
      markersRef.current = {};
      
      // Add a marker for each profile
      profiles.forEach(profile => {
        const { location, name, id } = profile;
        
        if (location && location.lat && location.lng) {
          // Create a simple marker
          const marker = L.marker([location.lat, location.lng]).addTo(map);
          
          // Store marker reference for later updates
          markersRef.current[id] = marker;
          
          // Bind popup to marker
          marker.bindPopup(`
            <div style="text-align:center; padding: 4px;">
              <h3 style="font-weight:bold; color:#2563eb; margin-bottom:4px;">${name}</h3>
              <p style="color:#4b5563; margin:0;">${profile.address}</p>
              <button 
                id="view-profile-${id}" 
                style="background-color:#2563eb; color:white; padding:4px 10px; border-radius:4px; border:none; margin-top:8px; cursor:pointer; font-size:12px;"
              >
                View Details
              </button>
            </div>
          `);
            
          // Open popup for selected profile
          if (id === selectedProfileId) {
            marker.openPopup();
            map.setView([location.lat, location.lng], 10);
          }
          
          // Add event listeners to popup buttons
          marker.on('popupopen', () => {
            setTimeout(() => {
              const viewButton = document.getElementById(`view-profile-${id}`);
              
              if (viewButton) {
                viewButton.addEventListener('click', () => {
                  router.push(`/profile/${id}`);
                });
              }
            }, 0);
          });
          
          // Add click event to marker
          marker.on('click', () => {
            setSelectedProfileId(id);
          });
        }
      });
      
      // Add a resize handler to ensure the map renders correctly on window resize
      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);
      
      // Cleanup function to remove the map when component unmounts
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [profiles, selectedProfileId, setSelectedProfileId, router]); // Re-run when profiles or selection changes

  // Center map on selected profile when it changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedProfileId) return;
    
    const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);
    if (selectedProfile && selectedProfile.location) {
      const { lat, lng } = selectedProfile.location;
      mapInstanceRef.current.setView([lat, lng], 10);
      
      // Open popup for selected marker
      const marker = markersRef.current[selectedProfileId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedProfileId, profiles]);

  return (
    <div style={{ 
      height: '70vh', 
      width: '100%', 
      maxWidth: '1000px',
      margin: '20px auto',
      borderRadius: '8px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      border: '1px solid #4b5563',
      position: 'relative',
      backgroundColor: '#e5e7eb' // Light gray background for any empty space
    }}>
      <div id="map" ref={mapRef} style={{ 
        height: '100%', 
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }} />
    </div>
  );
}