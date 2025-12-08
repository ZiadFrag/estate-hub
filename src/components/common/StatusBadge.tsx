import { cn } from '@/lib/utils';

type StatusType = 
  | 'Available' | 'Sold' | 'Pending' | 'Rented' 
  | 'Active' | 'Inactive' | 'Expired'
  | 'available' | 'sold' | 'pending' | 'rented'
  | 'active' | 'inactive' | 'expired';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const getStatusStyle = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'available':
    case 'active':
      return 'badge-available';
    case 'sold':
    case 'inactive':
      return 'badge-sold';
    case 'pending':
    case 'expired':
      return 'badge-pending';
    case 'rented':
      return 'badge-rented';
    default:
      return 'badge-pending';
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn('badge-status', getStatusStyle(status), className)}>
      {status}
    </span>
  );
}
