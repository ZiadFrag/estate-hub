import { cn } from '@/lib/utils';

type StatusType = 'Available' | 'Sold' | 'Pending' | 'Rented' | 'Active' | 'Inactive' | 'Expired';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  Available: 'badge-available',
  Sold: 'badge-sold',
  Pending: 'badge-pending',
  Rented: 'badge-rented',
  Active: 'badge-available',
  Inactive: 'badge-sold',
  Expired: 'badge-pending',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn('badge-status', statusStyles[status], className)}>
      {status}
    </span>
  );
}
