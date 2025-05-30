'use client'

import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import IncomeLegend from './components/IncomeLegend'
import FloatingNavbar from './components/FloatingNavbar'
import PropertyLayer from './components/PropertyLayer'
import LayerControls from './components/LayerControls'
import PropertySidebar from './components/PropertySidebar'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface PropertyDetails {
  id: string;
  price: number;
  address: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  type: 'sale' | 'sold' | 'pending';
}

const useMapbox = (container: React.RefObject<HTMLDivElement | null>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  
  const [layerVisibility, setLayerVisibility] = useState({
    income: true,
    properties: false
  });

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
      style: 'mapbox://styles/mapbox/light-v11',
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

      // Add data source for income
      map.current.addSource('blockgroup-income', {
        type: 'geojson',
        data: '/orange_county_blockgroups_with_income_cleaned.geojson'
      });

      // Add income heatmap layer with more professional colors
      map.current.addLayer({
        id: 'income-choropleth',
        type: 'fill',
        source: 'blockgroup-income',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['to-number', ['get', 'ACSDT5Y2023.B19013-Data_B19013_001E']],
            0, '#94a3b8',      // Medium gray for lowest income
            50000, '#64748b',  // Dark gray
            75000, '#475569',  // Darker slate
            100000, '#334155', // Very dark slate
            150000, '#1e293b', // Deep navy slate
            200000, '#0f172a'  // Very deep navy for highest income
          ],
          'fill-opacity': .8
        }
      });

      // Add border layer
      map.current.addLayer({
        id: 'income-borders',
        type: 'line',
        source: 'blockgroup-income',
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.5,
          'line-opacity': 0.8
        }
      });

      // Handle hover states
      map.current.on('mouseenter', 'income-choropleth', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'income-choropleth', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [container]);

  // Handle layer visibility changes
  useEffect(() => {
    if (!map.current) return;

    // Toggle income layer
    if (map.current.getLayer('income-choropleth')) {
      map.current.setLayoutProperty('income-choropleth', 'visibility', layerVisibility.income ? 'visible' : 'none');
      map.current.setLayoutProperty('income-borders', 'visibility', layerVisibility.income ? 'visible' : 'none');
    }
  }, [layerVisibility.income]);

  return { map: map.current, moveToLocation, layerVisibility, setLayerVisibility };
};

const Main = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map, moveToLocation, layerVisibility, setLayerVisibility } = useMapbox(mapContainer);
  
  // Property sidebar state
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Layer control handlers
  const handleIncomeToggle = (visible: boolean) => {
    setLayerVisibility(prev => ({ ...prev, income: visible }));
  };

  const handlePropertyToggle = (visible: boolean) => {
    setLayerVisibility(prev => ({ ...prev, properties: visible }));
  };

  // Property selection handler
  const handlePropertyClick = (property: PropertyDetails) => {
    setSelectedProperty(property);
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Layer Controls */}
      <LayerControls 
        onIncomeToggle={handleIncomeToggle}
        onPropertyToggle={handlePropertyToggle}
      />
      
      {/* Income Legend */}
      {layerVisibility.income && <IncomeLegend />}
      
      {/* Property Layer */}
      <PropertyLayer 
        map={map} 
        visible={layerVisibility.properties}
        onPropertyClick={handlePropertyClick}
      />
      
      {/* Property Sidebar */}
      <PropertySidebar
        property={selectedProperty}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />
      
      {/* Navigation */}
      <FloatingNavbar onLocationSelect={moveToLocation} />
    </div>
  );
};

export default Main;