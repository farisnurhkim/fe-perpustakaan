import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType; 
  iconColor: string;      
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, iconColor }) => {
  return (
    <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-700 hover:border-emerald-700 transition-all duration-200 bg-[#0f172a] min-h-[130px]">
      <h3 className="text-sm font-medium text-slate-400">
        {label}
      </h3>
      
      <div className="flex items-center gap-3 mt-4">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        <span className="text-2xl font-semibold text-white">
          {value}
        </span>
      </div>
    </div>
  );
};

const BookStatCard = ({stats}: {stats: StatCardProps[]}) => {
    

  return (
    <div className="w-full bg-[#020617] mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-full w-full mx-auto">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default BookStatCard;