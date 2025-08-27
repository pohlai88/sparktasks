/**
 * DataDemo - MAPS v3.0 Data-Enhanced Components Showcase
 *
 * Apple HIG Philosophy with sophisticated color selection and elegant design.
 * Demonstrates the 80/20 strategy with professional, user-respectful styling.
 */

import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Mail,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

// Import implemented data-enhanced components
import { BarChart, LineChart } from '../data-enhanced/Charts';
import { EnhancedForm } from '../data-enhanced/EnhancedForm';
import { SimpleTable } from '../data-enhanced/SimpleTable';
import {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
} from '../ui-enhanced/Card';

// Demo data types
interface SalesData {
  id: number;
  month: string;
  revenue: number;
  customers: number;
  growth: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  joinDate: string;
  lastActive: string;
}

// Mock data with enhanced realism
const salesData: SalesData[] = [
  { id: 1, month: 'Jan', revenue: 125000, customers: 320, growth: 12.5 },
  { id: 2, month: 'Feb', revenue: 138000, customers: 348, growth: 10.4 },
  { id: 3, month: 'Mar', revenue: 152000, customers: 385, growth: 10.1 },
  { id: 4, month: 'Apr', revenue: 168000, customers: 421, growth: 10.5 },
  { id: 5, month: 'May', revenue: 185000, customers: 458, growth: 10.1 },
  { id: 6, month: 'Jun', revenue: 203000, customers: 495, growth: 9.7 },
];

const userData: UserData[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    status: 'active',
    role: 'Design Lead',
    joinDate: '2023-01-15',
    lastActive: '2 minutes ago',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    email: 'marcus.r@company.com',
    status: 'active',
    role: 'Product Manager',
    joinDate: '2023-02-20',
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    status: 'inactive',
    role: 'Developer',
    joinDate: '2023-03-10',
    lastActive: '3 days ago',
  },
  {
    id: 4,
    name: 'David Park',
    email: 'david.park@company.com',
    status: 'active',
    role: 'Data Analyst',
    joinDate: '2023-04-05',
    lastActive: '30 minutes ago',
  },
  {
    id: 5,
    name: 'Zara Ahmed',
    email: 'zara.ahmed@company.com',
    status: 'pending',
    role: 'UX Researcher',
    joinDate: '2023-05-12',
    lastActive: 'Never',
  },
];

// Form schemas
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const userFormSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
});

// Apple HIG Color Palette following ComponentsDemo sophistication
const APPLE_HIG_STATUS_COLORS = {
  active: {
    background: 'bg-emerald-50 dark:bg-emerald-950/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  inactive: {
    background: 'bg-slate-50 dark:bg-slate-950/20',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700/50',
    icon: 'text-slate-500 dark:text-slate-500',
  },
  pending: {
    background: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/50',
    icon: 'text-amber-600 dark:text-amber-400',
  },
} as const;

export function DataDemo() {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Sophisticated Apple HIG-inspired status badge component
  const StatusBadge = ({ status }: { status: UserData['status'] }) => {
    const colors = APPLE_HIG_STATUS_COLORS[status];
    const icons = {
      active: <CheckCircle className='h-3 w-3' />,
      inactive: <XCircle className='h-3 w-3' />,
      pending: <Clock className='h-3 w-3' />,
    };

    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${colors.background} ${colors.border}`}
      >
        <span className={colors.icon}>{icons[status]}</span>
        <span className={`text-xs font-medium ${colors.text}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  // Table columns with sophisticated styling
  const userColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: { row: { original: UserData } }) => (
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-medium text-white'>
            {row.original.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div>
            <p className='font-medium text-foreground'>{row.original.name}</p>
            <p className='text-xs text-muted-foreground'>{row.original.role}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }: { row: { original: UserData } }) => (
        <div className='space-y-1'>
          <p className='text-sm text-foreground'>{row.original.email}</p>
          <p className='text-xs text-muted-foreground'>
            Active {row.original.lastActive}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: UserData } }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      accessorKey: 'joinDate',
      header: 'Member Since',
      cell: ({ row }: { row: { original: UserData } }) => (
        <div className='text-sm text-foreground'>
          {new Date(row.original.joinDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
  ];

  const salesColumns = [
    {
      accessorKey: 'month',
      header: 'Period',
      cell: ({ row }: { row: { original: SalesData } }) => (
        <div className='font-medium text-foreground'>{row.original.month}</div>
      ),
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }: { row: { original: SalesData } }) => (
        <div className='flex items-center gap-2'>
          <DollarSign className='h-4 w-4 text-emerald-500' />
          <span className='font-semibold text-foreground'>
            ${row.original.revenue.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'customers',
      header: 'Customers',
      cell: ({ row }: { row: { original: SalesData } }) => (
        <div className='flex items-center gap-2'>
          <Users className='h-4 w-4 text-blue-500' />
          <span className='text-foreground'>
            {row.original.customers.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'growth',
      header: 'Growth',
      cell: ({ row }: { row: { original: SalesData } }) => {
        const growth = row.original.growth;
        return (
          <div className='flex items-center gap-1.5'>
            {growth > 0 ? (
              <TrendingUp className='h-4 w-4 text-emerald-500' />
            ) : (
              <TrendingDown className='h-4 w-4 text-red-500' />
            )}
            <span
              className={`font-medium ${
                growth > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {growth > 0 ? '+' : ''}
              {growth}%
            </span>
          </div>
        );
      },
    },
  ];

  // Chart data transformations
  const barChartData = salesData.map(item => ({
    month: item.month,
    revenue: item.revenue / 1000, // Convert to thousands for display
  }));

  const lineChartData = salesData.map(item => ({
    x: item.month,
    y: item.growth,
  }));

  // Calculate metrics for elegant metric cards
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCustomers = salesData.at(-1)?.customers || 0;
  const activeUsers = userData.filter(u => u.status === 'active').length;
  const avgGrowth =
    salesData.reduce((sum, item) => sum + item.growth, 0) / salesData.length;

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-7xl space-y-12'>
        {/* Header with Apple HIG sophistication */}
        <div className='space-y-4 text-center'>
          <h1 className='text-4xl font-bold text-foreground'>
            MAPS v3.0 Data-Enhanced Showcase
          </h1>
          <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
            Professional data components following Apple HIG philosophy -
            sophisticated, user-respectful design with the 80/20 strategy for
            comprehensive data applications.
          </p>
        </div>

        {/* Elegant Metrics Dashboard - Apple-inspired cards */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Analytics Overview
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <EnhancedCard className='border-emerald-200/20 dark:border-emerald-800/20'>
              <EnhancedCardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Revenue
                    </p>
                    <p className='text-2xl font-bold text-foreground'>
                      ${totalRevenue.toLocaleString()}
                    </p>
                    <div className='flex items-center gap-1 text-sm'>
                      <TrendingUp className='h-4 w-4 text-emerald-500' />
                      <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                        +12.3%
                      </span>
                      <span className='text-muted-foreground'>
                        vs last quarter
                      </span>
                    </div>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30'>
                    <DollarSign className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard className='border-blue-200/20 dark:border-blue-800/20'>
              <EnhancedCardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Customers
                    </p>
                    <p className='text-2xl font-bold text-foreground'>
                      {totalCustomers.toLocaleString()}
                    </p>
                    <div className='flex items-center gap-1 text-sm'>
                      <TrendingUp className='h-4 w-4 text-blue-500' />
                      <span className='font-medium text-blue-600 dark:text-blue-400'>
                        +8.7%
                      </span>
                      <span className='text-muted-foreground'>
                        vs last quarter
                      </span>
                    </div>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                    <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard className='border-purple-200/20 dark:border-purple-800/20'>
              <EnhancedCardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Active Users
                    </p>
                    <p className='text-2xl font-bold text-foreground'>
                      {activeUsers}
                    </p>
                    <div className='flex items-center gap-1 text-sm'>
                      <Activity className='h-4 w-4 text-purple-500' />
                      <span className='font-medium text-purple-600 dark:text-purple-400'>
                        {Math.round((activeUsers / userData.length) * 100)}%
                      </span>
                      <span className='text-muted-foreground'>
                        engagement rate
                      </span>
                    </div>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30'>
                    <Activity className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard className='border-amber-200/20 dark:border-amber-800/20'>
              <EnhancedCardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Avg Growth
                    </p>
                    <p className='text-2xl font-bold text-foreground'>
                      {avgGrowth.toFixed(1)}%
                    </p>
                    <div className='flex items-center gap-1 text-sm'>
                      <Star className='h-4 w-4 text-amber-500' />
                      <span className='font-medium text-amber-600 dark:text-amber-400'>
                        Excellent
                      </span>
                      <span className='text-muted-foreground'>performance</span>
                    </div>
                  </div>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30'>
                    <BarChart3 className='h-6 w-6 text-amber-600 dark:text-amber-400' />
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </section>

        {/* Charts Section with sophisticated cards */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Data Visualization
          </h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <EnhancedCard className='border-border'>
              <EnhancedCardHeader>
                <EnhancedCardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5 text-blue-500' />
                  Monthly Revenue
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Revenue trends over 6 months with sophisticated data
                  visualization
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <BarChart
                  data={barChartData}
                  indexBy='month'
                  keys={['revenue']}
                  title='Revenue by Month (in thousands)'
                  height={300}
                  colors={['#3B82F6']}
                />
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard className='border-border'>
              <EnhancedCardHeader>
                <EnhancedCardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-emerald-500' />
                  Growth Percentage
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Month-over-month growth rates with trend analysis
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div style={{ height: 300 }}>
                  <LineChart
                    data={[{ id: 'growth', data: lineChartData }]}
                    title='Growth Trend'
                    height={300}
                    colors={['#10B981']}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    lines={[
                      {
                        id: 'growth',
                        label: 'Growth %',
                        dataKey: 'y',
                      },
                    ]}
                  />
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </section>

        {/* Data Tables with elegant styling */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Data Management
          </h2>

          <EnhancedCard className='border-border'>
            <EnhancedCardHeader>
              <EnhancedCardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-purple-500' />
                Team Management
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Interactive user data table with sophisticated selection and
                filtering
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <SimpleTable
                data={userData}
                columns={userColumns}
                sortable={true}
                onRowClick={user => setSelectedUser(user)}
                pagination={{ pageSize: 10 }}
                className='mb-4'
              />
              {selectedUser && (
                <div className='mt-4 rounded-lg border border-border bg-muted/50 p-4'>
                  <h4 className='font-medium text-foreground'>
                    Selected Team Member
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    {selectedUser.name} ({selectedUser.email}) -{' '}
                    {selectedUser.role}
                  </p>
                  <div className='mt-2 flex items-center gap-2'>
                    <StatusBadge status={selectedUser.status} />
                    <span className='text-xs text-muted-foreground'>
                      Last active: {selectedUser.lastActive}
                    </span>
                  </div>
                </div>
              )}
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard className='border-border'>
            <EnhancedCardHeader>
              <EnhancedCardTitle className='flex items-center gap-2'>
                <DollarSign className='h-5 w-5 text-emerald-500' />
                Financial Performance
              </EnhancedCardTitle>
              <EnhancedCardDescription>
                Sales data with custom formatting and trend indicators
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <SimpleTable
                data={salesData}
                columns={salesColumns}
                sortable={true}
                striped={true}
                density='comfortable'
                pagination={{ pageSize: 6 }}
              />
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Forms Section with elegant layouts */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Enhanced Forms
          </h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <EnhancedCard className='border-border'>
              <EnhancedCardHeader>
                <EnhancedCardTitle className='flex items-center gap-2'>
                  <Mail className='h-5 w-5 text-blue-500' />
                  Contact Form
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Professional contact form with validation and Apple HIG
                  styling
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <EnhancedForm
                  schema={contactFormSchema}
                  onSubmit={data => {
                    console.log('Contact form submitted:', data);
                    alert('Message sent successfully!');
                  }}
                  fields={[
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Full Name',
                      placeholder: 'Enter your name',
                    },
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email Address',
                      placeholder: 'your@email.com',
                    },
                  ]}
                  submitLabel='Send Message'
                  layout='vertical'
                />
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard className='border-border'>
              <EnhancedCardHeader>
                <EnhancedCardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5 text-purple-500' />
                  User Registration
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Create new team member with sophisticated form validation
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <EnhancedForm
                  schema={userFormSchema}
                  onSubmit={data => {
                    console.log('User form submitted:', data);
                    alert('User created successfully!');
                  }}
                  fields={[
                    { name: 'name', type: 'text', label: 'Name' },
                    { name: 'email', type: 'email', label: 'Email' },
                  ]}
                  submitLabel='Create User'
                  layout='vertical'
                />
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </section>

        {/* Implementation Notes with Apple HIG elegance */}
        <section className='space-y-4 border-t pt-8'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Implementation Notes
          </h2>
          <EnhancedCard className='border-border'>
            <EnhancedCardContent className='p-6'>
              <div className='prose prose-sm max-w-none'>
                <p className='mb-4 text-muted-foreground'>
                  This showcase demonstrates the{' '}
                  <strong className='text-foreground'>80/20 Strategy</strong> in
                  action: our 3 data-enhanced components cover 80% of typical
                  data visualization and form requirements with sophisticated
                  Apple HIG color philosophy and user-respectful design.
                </p>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div>
                    <h3 className='mb-3 text-lg font-semibold text-foreground'>
                      Components Demonstrated
                    </h3>
                    <ul className='space-y-2 text-sm'>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-blue-500' />
                        <span className='text-foreground'>
                          <strong>SimpleTable</strong> - Universal data table
                          with sorting, pagination, selection
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-emerald-500' />
                        <span className='text-foreground'>
                          <strong>EnhancedForm</strong> - Schema-driven forms
                          with validation and elegant layouts
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-purple-500' />
                        <span className='text-foreground'>
                          <strong>BarChart & LineChart</strong> - Professional
                          visualization with Nivo integration
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='mb-3 text-lg font-semibold text-foreground'>
                      Technical Excellence
                    </h3>
                    <ul className='space-y-2 text-sm'>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-amber-500' />
                        <span className='text-foreground'>
                          MAPS v3.0 design system integration
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-blue-500' />
                        <span className='text-foreground'>
                          Apple HIG sophisticated color philosophy
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-emerald-500' />
                        <span className='text-foreground'>
                          TypeScript with comprehensive type safety
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-purple-500' />
                        <span className='text-foreground'>
                          WCAG AAA accessibility compliance
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-rose-500' />
                        <span className='text-foreground'>
                          Liquid glass materials and dark mode excellence
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>
      </div>
    </div>
  );
}

export default DataDemo;
