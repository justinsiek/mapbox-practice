const IncomeLegend = () => {
  const legendItems = [
    { color: '#94a3b8', range: '$0 - $50k' },
    { color: '#64748b', range: '$50k - $75k' },
    { color: '#475569', range: '$75k - $100k' },
    { color: '#334155', range: '$100k - $150k' },
    { color: '#1e293b', range: '$150k - $200k' },
    { color: '#0f172a', range: '$200k+' },
  ];

  return (
    <div className="absolute bottom-8 left-8 bg-white shadow-lg border border-gray-100 overflow-hidden w-64">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3">
        <h3 className="font-medium text-sm text-white">Income Distribution</h3>
      </div>
      
      {/* Legend Items */}
      <div className="p-4 space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 border border-gray-200" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700">{item.range}</span>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          ACS 2023 5-Year Estimates
        </div>
      </div>
    </div>
  );
};

export default IncomeLegend; 