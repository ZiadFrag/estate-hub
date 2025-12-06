import { Building2, Users, FileText, CreditCard, UserCheck, TrendingUp, Calendar, List } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PropertyChart } from '@/components/dashboard/PropertyChart';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { dashboardStats, mockProperties, mockListings, mockAgents } from '@/data/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's an overview of your real estate agency.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={dashboardStats.totalProperties}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
          className="animate-slide-up"
        />
        <StatCard
          title="Total Clients"
          value={dashboardStats.totalClients}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          className="animate-slide-up delay-100"
        />
        <StatCard
          title="Active Contracts"
          value={dashboardStats.activeContracts}
          icon={FileText}
          trend={{ value: 5, isPositive: true }}
          className="animate-slide-up delay-200"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(dashboardStats.totalPayments / 1000).toFixed(0)}k`}
          icon={CreditCard}
          iconClassName="bg-accent"
          trend={{ value: 23, isPositive: true }}
          className="animate-slide-up delay-300"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Properties"
          value={dashboardStats.availableProperties}
          icon={TrendingUp}
          className="animate-slide-up delay-100"
        />
        <StatCard
          title="Total Agents"
          value={dashboardStats.totalAgents}
          icon={UserCheck}
          className="animate-slide-up delay-200"
        />
        <StatCard
          title="Property Visits"
          value={dashboardStats.propertyVisitsThisMonth}
          icon={Calendar}
          className="animate-slide-up delay-300"
        />
        <StatCard
          title="Active Listings"
          value={dashboardStats.activeListings}
          icon={List}
          className="animate-slide-up delay-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <PropertyChart />
      </div>

      {/* Recent Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Recent Properties */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Recent Properties</h3>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Type</th>
                    <th>City</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProperties.slice(0, 5).map((property, index) => (
                    <tr key={property.property_id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="font-medium">{property.address}</td>
                      <td>{property.property_type}</td>
                      <td>{property.city}</td>
                      <td>${property.price.toLocaleString()}</td>
                      <td>
                        <StatusBadge status={property.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
