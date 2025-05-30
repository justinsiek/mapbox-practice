interface IncomePopupProps {
  income: string | null;
}

const IncomePopup = ({ income }: IncomePopupProps) => {
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

export default IncomePopup; 