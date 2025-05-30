import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface Property {
  id: string;
  lng: number;
  lat: number;
  price: number;
  type: 'sale' | 'sold' | 'pending';
  address: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
}

// Mock property data - in production this would come from First American's APIs
const mockProperties: Property[] = [
  {
    id: '1',
    lng: -117.8265,
    lat: 33.6846,
    price: 850000,
    type: 'sale',
    address: '123 Main St, Irvine, CA',
    sqft: 2100,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    id: '2', 
    lng: -117.8165,
    lat: 33.6946,
    price: 725000,
    type: 'sold',
    address: '456 Oak Ave, Irvine, CA',
    sqft: 1850,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    id: '3',
    lng: -117.8365,
    lat: 33.6746,
    price: 950000,
    type: 'pending',
    address: '789 Pine Dr, Irvine, CA',
    sqft: 2400,
    bedrooms: 4,
    bathrooms: 3
  }
];

interface PropertyLayerProps {
  map: mapboxgl.Map | null;
  visible: boolean;
  onPropertyClick: (property: Property) => void;
}

const PropertyLayer = ({ map, visible, onPropertyClick }: PropertyLayerProps) => {
  useEffect(() => {
    if (!map) return;

    // Create GeoJSON from property data
    const propertyGeoJSON = {
      type: 'FeatureCollection' as const,
      features: mockProperties.map(property => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [property.lng, property.lat]
        },
        properties: {
          id: property.id,
          price: property.price,
          type: property.type,
          address: property.address,
          sqft: property.sqft,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms
        }
      }))
    };

    // Add property data source
    if (!map.getSource('properties')) {
      map.addSource('properties', {
        type: 'geojson',
        data: propertyGeoJSON
      });

      // Add property points layer with more professional styling
      map.addLayer({
        id: 'property-points',
        type: 'circle',
        source: 'properties',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 8,
            15, 12
          ],
          'circle-color': [
            'match',
            ['get', 'type'],
            'sale', '#1e293b',      // Dark slate for sale
            'sold', '#64748b',      // Medium slate for sold  
            'pending', '#334155',   // Darker slate for pending
            '#94a3b8'               // Light slate default
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 1.0
        }
      });

      // Add property click handler to open sidebar
      map.on('click', 'property-points', (e) => {
        if (e.features && e.features[0] && e.features[0].properties) {
          const properties = e.features[0].properties;
          
          // Find the full property object
          const property = mockProperties.find(p => p.id === properties.id);
          if (property) {
            onPropertyClick(property);
          }
        }
      });

      // Change cursor on hover
      map.on('mouseenter', 'property-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'property-points', () => {
        map.getCanvas().style.cursor = '';
      });
    }

    // Toggle visibility
    if (map.getLayer('property-points')) {
      map.setLayoutProperty('property-points', 'visibility', visible ? 'visible' : 'none');
    }

  }, [map, visible, onPropertyClick]);

  return null;
};

export default PropertyLayer; 