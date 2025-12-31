import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function CategoryBreakdown({ data }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-6">Score by Category</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              width={75}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => [`${value}%`, 'Average Score']}
            />
            <Bar dataKey="averageScore" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
