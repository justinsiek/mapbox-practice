import { useState } from 'react';

interface LayerControlsProps {
  onIncomeToggle: (visible: boolean) => void;
  onPropertyToggle: (visible: boolean) => void;
}

const LayerControls = ({ 
  onIncomeToggle, 
  onPropertyToggle
}: LayerControlsProps) => {
  const [layers, setLayers] = useState({
    income: true,
    properties: false
  });

  const toggleLayer = (layerName: keyof typeof layers) => {
    const newLayers = { ...layers, [layerName]: !layers[layerName] };
    setLayers(newLayers);

    // Call appropriate callback
    switch (layerName) {
      case 'income':
        onIncomeToggle(newLayers.income);
        break;
      case 'properties':
        onPropertyToggle(newLayers.properties);
        break;
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white shadow-lg border border-gray-100 overflow-hidden w-64">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3">
        <h3 className="font-medium text-sm text-white">Data Layers</h3>
      </div>
      
      {/* Layer Controls */}
      <div className="p-4 space-y-4">
        
        {/* Census Income Layer */}
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-300 to-slate-700 mr-3 mt-0.5 border border-gray-200"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Census Income</div>
              <div className="text-xs text-gray-500">Median household income</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={layers.income}
              onChange={() => toggleLayer('income')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        {/* Properties Layer */}
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-slate-900 rounded-full mr-3 mt-0.5"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">Properties</div>
              <div className="text-xs text-gray-500">Listing data points</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={layers.properties}
              onChange={() => toggleLayer('properties')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>
      </div>

      {/* Status Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          {Object.entries(layers)
            .filter(([_, active]) => active)
            .map(([layer, _]) => layer.charAt(0).toUpperCase() + layer.slice(1))
            .join(', ') || 'No layers active'}
        </div>
      </div>
    </div>
  );
};

export default LayerControls; 