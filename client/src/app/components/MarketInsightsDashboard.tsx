import { useState } from 'react';

interface MarketMetrics {
  avgPrice: number;
  medianPrice: number;
  totalListings: number;
  daysOnMarket: number;
  pricePerSqft: number;
  saleVolume: number;
  priceChange: number;
  inventoryLevel: string;
}

const MarketInsightsDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock market data - in production this would come from First American's APIs
  const marketMetrics: MarketMetrics = {
    avgPrice: 847000,
    medianPrice: 825000,
    totalListings: 156,
    daysOnMarket: 23,
    pricePerSqft: 685,
    saleVolume: 2.4, // in millions
    priceChange: 5.2, // percentage
    inventoryLevel: 'Low'
  };

  const formatPrice = (price: number) => `$${(price / 1000).toFixed(0)}K`;
  const formatLargeNumber = (num: number) => `${(num / 1000000).toFixed(1)}M`;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between text-white">
          <h3 className="font-bold text-sm">Market Insights</h3>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
        <div className="text-xs text-blue-100 mt-1">Orange County, CA</div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 w-80">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-xs text-green-600 font-medium">Avg Price</div>
              <div className="text-lg font-bold text-green-800">{formatPrice(marketMetrics.avgPrice)}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-blue-600 font-medium">Median Price</div>
              <div className="text-lg font-bold text-blue-800">{formatPrice(marketMetrics.medianPrice)}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-xs text-purple-600 font-medium">Listings</div>
              <div className="text-lg font-bold text-purple-800">{marketMetrics.totalListings}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <div className="text-xs text-orange-600 font-medium">Days on Market</div>
              <div className="text-lg font-bold text-orange-800">{marketMetrics.daysOnMarket}</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Price per Sq Ft</span>
              <span className="font-semibold">${marketMetrics.pricePerSqft}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Sale Volume</span>
              <span className="font-semibold">{formatLargeNumber(marketMetrics.saleVolume * 1000000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Price Change (YoY)</span>
              <span className={`font-semibold ${marketMetrics.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketMetrics.priceChange >= 0 ? '+' : ''}{marketMetrics.priceChange}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Inventory Level</span>
              <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                marketMetrics.inventoryLevel === 'Low' ? 'bg-red-100 text-red-800' :
                marketMetrics.inventoryLevel === 'High' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {marketMetrics.inventoryLevel}
              </span>
            </div>
          </div>

          {/* Action Buttons for Sales Team */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
              <button className="flex-1 bg-gray-600 text-white text-xs py-2 px-3 rounded hover:bg-gray-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>

          {/* Market Opportunity Indicator */}
          <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded">
            <div className="text-xs font-medium text-green-800 mb-1">Market Opportunity</div>
            <div className="text-xs text-green-700">
              High demand area with {marketMetrics.daysOnMarket} day avg. DOM. 
              Strong price appreciation indicates growth potential.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketInsightsDashboard; 