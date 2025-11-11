import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'warning';
}

export default function SummaryCard({ title, value, icon: Icon, variant = 'default' }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${variant === 'warning' ? 'text-orange-600' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${variant === 'warning' ? 'bg-orange-100' : 'bg-blue-100'}`}>
          <Icon className={`w-6 h-6 ${variant === 'warning' ? 'text-orange-600' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );
}
