import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockProperties } from '@/data/mockData';

const statusCounts = mockProperties.reduce((acc, property) => {
  acc[property.status] = (acc[property.status] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const data = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

const COLORS = {
  Available: 'hsl(var(--success))',
  Sold: 'hsl(var(--destructive))',
  Pending: 'hsl(var(--warning))',
  Rented: 'hsl(var(--primary))',
};

export function PropertyChart() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold mb-4">Property Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
