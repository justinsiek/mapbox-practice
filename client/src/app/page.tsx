'use client'

import { useRef, useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const IncomeLegend = () => {
  const legendItems = [
    { color: '#d73027', range: '$0 - $50k' },
    { color: '#f46d43', range: '$50k - $75k' },
    { color: '#fdae61', range: '$75k - $100k' },
    { color: '#fee08b', range: '$100k - $150k' },
    { color: '#a6d96a', range: '$150k - $200k' },
    { color: '#1a9850', range: '$200k+' },
  ];

  return (
    <>
      <style jsx global>{`
        .mapboxgl-popup-close-button {
          background: rgba(255, 255, 255, 0.9) !important;
          font-size: 16px !important;
          font-weight: bold !important;
          top: 4px !important;
          right: 8px !important;
        }

      `}</style>
      <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-sm mb-2">Median Household Income</h3>
        <div className="space-y-1 text-xs">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 opacity-70" 
                style={{ backgroundColor: item.color }}
              />
              <span>{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const IncomePopup = ({ income }: { 
  income: string | null; 
}) => {
  const formattedIncome = income ? parseInt(income).toLocaleString() : null;
  
  return (
    <div className="text-center pt-1 pr-6 pb-2 pl-2">
      <div className="text-xs text-gray-500 font-medium">Median Income</div>
      <div className={`font-bold text-base ${formattedIncome ? 'text-green-600' : 'text-gray-400'}`}>
        {formattedIncome ? `$${formattedIncome}` : 'No data'}
      </div>
    </div>
  );
};

const useMapbox = (container: React.RefObject<HTMLDivElement | null>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{
    income: string | null;
    name: string | null;
    geoid: string | null;
    lngLat: [number, number];
  } | null>(null);

  useEffect(() => {
    if (map.current || !container.current) return;

    map.current = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-117.8265, 33.6846],
      zoom: 10
    });

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('blockgroup-income', {
        type: 'geojson',
        data: '/orange_county_blockgroups_with_income.geojson'
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

  return { map: map.current, selectedRegion, setSelectedRegion };
};

const Main = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map, selectedRegion, setSelectedRegion } = useMapbox(mapContainer);

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
    </div>
  );
};

export default Main;