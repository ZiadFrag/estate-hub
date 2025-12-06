import { FileText, CreditCard, Calendar, Building2 } from 'lucide-react';

const activities = [
  {
    icon: Building2,
    title: 'New property listed',
    description: '505 Coastal Way, Malibu',
    time: '2 hours ago',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: FileText,
    title: 'Contract signed',
    description: 'Sale contract for 456 Pine Avenue',
    time: '4 hours ago',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  {
    icon: CreditCard,
    title: 'Payment received',
    description: '$45,000 deposit received',
    time: '6 hours ago',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  {
    icon: Calendar,
    title: 'Property visit scheduled',
    description: '123 Oak Street with David Martinez',
    time: '1 day ago',
    iconBg: 'bg-chart-4/10',
    iconColor: 'text-chart-4',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-10 h-10 rounded-lg ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
