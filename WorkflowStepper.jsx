import React from 'react';

/**
 * VERY SIMPLE step indicator:
 * CAPTURE → EXTRACT → MATCH → VALIDATE → PROGRESS → RISK → RECOMMEND → REPORT → FORECAST
 * Only highlights the current step. Clean, lightweight, minimal.
 */
export const WorkflowStepper = ({ currentStep, onStepClick, userRole = 'PROJECT_MANAGER' }) => {
  const steps = [
    { id: 'capture', label: 'CAPTURE', roles: ['FIELD_ENGINEER', 'PROJECT_MANAGER', 'ADMIN'] },
    { id: 'extract', label: 'EXTRACT', roles: ['FIELD_ENGINEER', 'PROJECT_MANAGER', 'ADMIN'] },
    { id: 'match', label: 'MATCH', roles: ['FIELD_ENGINEER', 'PROJECT_MANAGER', 'ADMIN'] },
    { id: 'validate', label: 'VALIDATE', roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { id: 'progress', label: 'PROGRESS', roles: ['PROJECT_MANAGER', 'ADMIN', 'FIELD_ENGINEER', 'CITIZEN'] },
    { id: 'risk', label: 'RISK', roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { id: 'recommend', label: 'RECOMMEND', roles: ['PROJECT_MANAGER', 'ADMIN'] },
    { id: 'report', label: 'REPORT', roles: ['PROJECT_MANAGER', 'ADMIN', 'CITIZEN'] },
    { id: 'forecast', label: 'FORECAST', roles: ['PROJECT_MANAGER', 'ADMIN'] },
  ];

  // Filter or indicate based on role
  const visibleSteps = userRole === 'CITIZEN' 
    ? steps.filter(s => ['progress', 'report'].includes(s.id))
    : userRole === 'FIELD_ENGINEER'
    ? steps.filter(s => ['capture', 'extract', 'match', 'progress'].includes(s.id))
    : steps;

  return (
    <div className="w-full py-2.5 px-4 bg-white border-b border-slate-200/80 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 min-w-max text-[11px] font-medium tracking-wide">
        {visibleSteps.map((step, idx) => {
          const isCurrent = currentStep === step.id;
          const isLast = idx === visibleSteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepClick && onStepClick(step.id)}
                className={`px-2.5 py-1 rounded-md transition-colors duration-150 cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                {step.label}
              </button>

              {!isLast && (
                <span className="text-slate-300 select-none text-[10px]">
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
