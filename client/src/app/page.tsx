'use client'

import { useRef, useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import IncomeLegend from './components/IncomeLegend'
import IncomePopup from './components/IncomePopup'
import FloatingNavbar from './components/FloatingNavbar'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const useMapbox = (container: React.RefObject<HTMLDivElement | null>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    income: string | null;
    name: string | null;
    geoid: string | null;
    lngLat: [number, number];
  } | null>(null);

  const moveToLocation = (lngLat: [number, number]) => {
    if (map.current) {
      map.current.flyTo({
        center: lngLat,
        zoom: 14,
        duration: 1500
      });
    }
  };

  useEffect(() => {
    if (map.current || !container.current) return;

    map.current = new mapboxgl.Map({
      container: container.current,
      center: [-117.8265, 33.6846],
      zoom: 10,
      attributionControl: false
    });

    // Hide Mapbox logo
    const mapboxLogo = container.current.querySelector('.mapboxgl-ctrl-logo');
    if (mapboxLogo) {
      (mapboxLogo as HTMLElement).style.display = 'none';
    }

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('blockgroup-income', {
        type: 'geojson',
        data: '/orange_county_blockgroups_with_income_cleaned.geojson'
      });

      // Add heatmap layer
      map.current.addLayer({
        id: 'income-choropleth',
        type: 'fill',
        source: 'blockgroup-income',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['to-number', ['get', 'ACSDT5Y2023.B19013-Data_B19013_001E']],
            0, '#d73027',
            50000, '#f46d43',
            75000, '#fdae61',
            100000, '#fee08b', 
            150000, '#a6d96a', 
            200000, '#1a9850'  
          ],
          'fill-opacity': 0.7
        }
      });

      // Add border layer
      map.current.addLayer({
        id: 'income-borders',
        type: 'line',
        source: 'blockgroup-income',
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.5
        }
      });

      map.current.on('click', 'income-choropleth', (e) => {
        if (!map.current || !e.features?.[0]) return;

        const properties = e.features[0].properties;
        setSelectedRegion({
          income: properties?.['ACSDT5Y2023.B19013-Data_B19013_001E'] || null,
          name: properties?.['NAME'] || null,
          geoid: properties?.['GEOID'] || null,
          lngLat: [e.lngLat.lng, e.lngLat.lat]
        });
      });

      map.current.on('mouseenter', 'income-choropleth', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'income-choropleth', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'default';
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [container]);

  return { map: map.current, selectedRegion, setSelectedRegion, moveToLocation };
};

const Main = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map, selectedRegion, setSelectedRegion, moveToLocation } = useMapbox(mapContainer);

  useEffect(() => {
    if (!map || !selectedRegion) return;

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })
    .setLngLat(selectedRegion.lngLat)
    .setHTML(renderToString(<IncomePopup income={selectedRegion.income} />))
    .addTo(map);

    popup.on('close', () => setSelectedRegion(null));

    return () => {
      popup.remove();
    };
  }, [map, selectedRegion, setSelectedRegion]);

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapContainer} className="h-full w-full" />
      <IncomeLegend />
      <FloatingNavbar onLocationSelect={moveToLocation} />
    </div>
  );
};

export default Main;