'use client'

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const Main = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; 
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', 
      center: [-117.82410, 33.68525],
      zoom: 11.55
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); 

  return (
    <div ref={mapContainer} id="map-container" className='h-screen w-screen bg-red-200'/>
  )
}

export default Main;