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
    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl rounded-lg shadow-sm border border-gray-200/50 p-3">
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="font-medium text-gray-900 text-sm">Median Household Income</h3>
      </div>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm border border-gray-200/60" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-700 font-mono">{item.range}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-200/60">
        <div className="text-xs text-gray-500">
          Data: ACS 5-Year 2023
        </div>
      </div>
    </div>
  );
};

export default IncomeLegend; 