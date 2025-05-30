import { useEffect, useState } from 'react';

interface PropertyDetails {
  id: string;
  price: number;
  address: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  type: 'sale' | 'sold' | 'pending';
  listingDate?: string;
  daysOnMarket?: number;
  priceHistory?: Array<{ date: string; price: number; event: string }>;
}

interface PropertySidebarProps {
  property: PropertyDetails | null;
  onClose: () => void;
  isOpen: boolean;
}

const PropertySidebar = ({ property, onClose, isOpen }: PropertySidebarProps) => {
  const [marketData, setMarketData] = useState({
    areaMedianPrice: 785000,
    pricePerSqftArea: 650,
    comparablesSold: 12,
    marketAppreciation: 4.8
  });

  if (!property) return null;

  const pricePerSqft = Math.round(property.price / property.sqft);
  const statusColor = property.type === 'sale' ? 'text-blue-900' : 
                     property.type === 'sold' ? 'text-gray-600' : 'text-blue-700';

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Property Analysis</h2>
            <button 
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-20">
          
          {/* Basic Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-semibold text-gray-900">
                ${property.price.toLocaleString()}
              </div>
              <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusColor} bg-gray-50 rounded`}>
                {property.type}
              </span>
            </div>
            
            <div className="text-gray-600 mb-4 text-sm">{property.address}</div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center py-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Beds</div>
              </div>
              <div className="text-center py-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold text-gray-900">{property.bathrooms}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Baths</div>
              </div>
              <div className="text-center py-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold text-gray-900">{property.sqft.toLocaleString()}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Sq Ft</div>
              </div>
            </div>
          </div>

          {/* Financial Analysis */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Valuation</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price per Sq Ft</span>
                <span className="font-medium text-gray-900">${pricePerSqft}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Area Median</span>
                <span className="font-medium text-gray-900">${marketData.areaMedianPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Area Price/Sq Ft</span>
                <span className="font-medium text-gray-900">${marketData.pricePerSqftArea}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Market Position</span>
                <span className={`font-medium ${
                  property.price > marketData.areaMedianPrice ? 'text-slate-900' : 'text-slate-700'
                }`}>
                  {((property.price - marketData.areaMedianPrice) / marketData.areaMedianPrice * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Market Data</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center py-4 border border-gray-200 rounded">
                <div className="text-2xl font-semibold text-slate-900">{marketData.comparablesSold}</div>
                <div className="text-xs text-gray-500 mt-1">Recent Sales</div>
                <div className="text-xs text-gray-400">90 days</div>
              </div>
              
              <div className="text-center py-4 border border-gray-200 rounded">
                <div className="text-2xl font-semibold text-slate-900">+{marketData.marketAppreciation}%</div>
                <div className="text-xs text-gray-500 mt-1">Appreciation</div>
                <div className="text-xs text-gray-400">Year over year</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full bg-slate-900 text-white py-3 px-4 text-sm font-medium hover:bg-slate-800 transition-colors">
                Generate Report
              </button>
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 text-sm font-medium hover:bg-gray-50 transition-colors">
                Add to CRM
              </button>
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 text-sm font-medium hover:bg-gray-50 transition-colors">
                Export Data
              </button>
            </div>

            {/* Opportunity Note */}
            <div className="mt-6 p-4 bg-slate-50 border-l-4 border-slate-900">
              <div className="text-xs font-medium text-slate-900 mb-1">Market Opportunity</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                Property positioned {property.price > marketData.areaMedianPrice ? 'above' : 'below'} area median. 
                Consider for targeted outreach and lead generation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertySidebar; 