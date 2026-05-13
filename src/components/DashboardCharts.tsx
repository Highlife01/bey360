import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface ChartProps {
  invoices: any[];
  finance: any[];
}

export default function DashboardCharts({ invoices, finance }: ChartProps) {
  // Process data for AreaChart (Sales vs Purchases)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7); // YYYY-MM
  }).reverse();

  const monthlyData = last6Months.map(month => {
    const sales = invoices
      .filter(inv => inv.dueDate?.startsWith(month) && (inv.invoiceType === 'Satış' || inv.invoiceType === 'Hizmet'))
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    
    const purchases = invoices
      .filter(inv => inv.dueDate?.startsWith(month) && inv.invoiceType === 'Alış')
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    return { month, Satış: sales, Alış: purchases };
  });

  // Process data for PieChart (Expense categories)
  const expenseCategories = finance
    .filter(f => f.type === 'Gider')
    .reduce((acc: any, f) => {
      const category = f.category || 'Diğer';
      acc[category] = (acc[category] || 0) + (f.amount || 0);
      return acc;
    }, {});

  const pieData = Object.entries(expenseCategories).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="grid gap-6 lg:grid-cols-2 mt-8">
      <div className="card p-6 bg-slate-900/50 border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Satış & Alış Trendi</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="Satış" stroke="#22d3ee" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              <Area type="monotone" dataKey="Alış" stroke="#6366f1" fillOpacity={1} fill="url(#colorPurchases)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6 bg-slate-900/50 border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Gider Dağılımı</h3>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
