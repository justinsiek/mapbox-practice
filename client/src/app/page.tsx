'use client'

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const Main = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; 
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [-117.82410, 33.68525],
      zoom: 9
    });

    map.current.on('load', () => {map.current?.addSource('blockgroup-boundaries', {
        'type': 'geojson',
        'data': '/orange_county_blockgroups.geojson'
      });

      map.current?.addLayer({
        'id': 'blockgroup-outlines',
        'type': 'line',
        'source': 'blockgroup-boundaries',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#555',
          'line-width': 0.6
        }
      });
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