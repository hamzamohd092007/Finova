import React from "react";

const BudgetChart = ({ budgets, currencySign }) => {
  const totalBudget = budgets.reduce(
    (acc, curr) => acc + curr.budget,
    0
  );

  const totalSpent = budgets.reduce(
    (acc, curr) => acc + curr.spent,
    0
  );

  const radiusOuter = 117;
  const radiusInner = 97;
  const circumferenceOuter = 2 * Math.PI * radiusOuter;
  const circumferenceInner = 2 * Math.PI * radiusInner;
  let outerOffset = 0;
  let innerOffset = 0;

  return (
    <div className="relative w-75 h-75 flex items-center justify-center">
      <svg
        width="260"
        height="260"
        viewBox="0 0 260 260"
        className="-rotate-90"
      >
        {budgets.map((item) => {
          const percentage = item.budget / totalBudget;

          const strokeLength = percentage * circumferenceOuter;

          const segment = (
            <circle
              key={`budget-${item._id}`}
              cx="130"
              cy="130"
              r={radiusOuter}
              fill="none"
              stroke={item.color}
              strokeWidth="25"
              strokeDasharray={`${strokeLength} ${circumferenceOuter}`}
              strokeDashoffset={-outerOffset}
              strokeLinecap="butt"
            />
          );
          outerOffset += strokeLength;
          return segment;
        })}
        {budgets.map((item) => {
          const percentage = item.spent / totalSpent;

          const strokeLength = percentage * circumferenceInner;

          const segment = (
            <circle
              key={`spent-${item._id}`}
              cx="130"
              cy="130"
              r={radiusInner}
              fill="none"
              stroke={item.color}
              strokeWidth="15"
              strokeDasharray={`${strokeLength} ${circumferenceInner}`}
              strokeDashoffset={-innerOffset}
              strokeLinecap="butt"
              opacity={0.8}
            />
          );
          innerOffset += strokeLength;
          return segment;
        })}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-neutral-800">
          {`${currencySign}${totalSpent.toFixed(2)}`}
        </h2>

        <span className="text-sm text-neutral-400 font-semibold px-2">
          {`of ${currencySign}${totalBudget.toFixed(2)} limit`}
        </span>
      </div>
    </div>
  );
};

export default BudgetChart;