import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Sector } from 'recharts';

const StudentFeePieChart = (Summary) => {
const baseAmount =1000
const lateFeeAmount =100
const summary = Summary?.Summary 
  const [activeIndex, setActiveIndex] = useState(null);

  // Calculate monetary values
  const paidAmount = summary?.paidCount * baseAmount;
  const unpaidAmount = summary?.unpaidCount * baseAmount;
  const lateFeeAmount_total = summary?.lateFeeCount * lateFeeAmount;
  const totalAmount = paidAmount + unpaidAmount + lateFeeAmount_total;

  // Prepare data for pie chart - only include non-zero values
  const data = [
    { name: 'Paid Fees', value: paidAmount, count: summary?.paidCount , color: '#C3EBFA' }, // Teal blue
    { name: 'Unpaid Fees', value: unpaidAmount, count: summary?.unpaidCount , color: '#CFCEFF' }, // Bright blue
    { name: 'Late Fees', value: lateFeeAmount_total, count: summary?.lateFeeCount, color: '#FAE27C' }, // Orange
  ].filter(item => item.value > 0 && item.count > 0); // Filter out zero values

  const COLORS = data.map(item => item.color);

  // 3D effect styling using gradients and shadow
  const create3DEffect = (startColor) => {
    return {
      fill: startColor,
      filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))',
    };
  };

  // Custom active shape for hover effect with 3D appearance
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    
    return (
      <g>
        <defs>
          <filter id={`shadow-${payload.name.replace(/\s+/g, '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feOffset result="offOut" in="SourceGraphic" dx="5" dy="5" />
            <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0" />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          filter={`url(#shadow-${payload.name.replace(/\s+/g, '')})`}
        />
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-lg font-semibold">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-base">
          ₹{value.toLocaleString()}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#666" className="text-sm">
          {payload.count} {payload.count === 1 ? 'student' : 'students'}
        </text>
      </g>
    );
  };

  // Handle mouse enter/leave for hover effect
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalAmount) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 shadow-lg rounded border border-gray-200">
          <p className="font-bold text-black-300">{data.name}</p>
          <p className="text-black-200">₹{data.value.toLocaleString()}</p>
          <p className="text-black-200">{data.count} {data.count === 1 ? 'student' : 'students'}</p>
          <p className="text-sm text-black-200">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Format for legend with percentages
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-6 lg:mt-8 mt-12">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.value / totalAmount) * 100).toFixed(1);
          return (
            <li key={`legend-${index}`} className="flex lg:items-center items-start gap-2">
              <div className="w-4 h-4 rounded-sm " style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm font-medium text-black-300">
                {entry.value} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };
// Custom label function to display name and value
const renderCustomLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload } = props;
  
  // Calculate position for the label
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
  // Create a line from the slice to the label
  const lineX1 = cx + (outerRadius + 10) * Math.cos(-midAngle * Math.PI / 180);
  const lineY1 = cy + (outerRadius + 10) * Math.sin(-midAngle * Math.PI / 180);
  
  return (
    <g>
      {/* Line connecting slice to label */}
      <line x1={lineX1} y1={lineY1} x2={x} y2={y} stroke={data[index].color} strokeWidth={1} />
      
      {/* Label text with name and value */}
      <text 
  x={x} 
  y={y-8} 
  fill="#333"
  textAnchor={x > cx ? 'start' : 'end'}
  dominantBaseline="central"
  fontSize="12"
  fontWeight="bold"
>
  {payload.name} {`₹${payload.value.toLocaleString()}`}
</text>
<text 
  x={x} 
  y={y+8} 
  fill="#333"
  textAnchor={x > cx ? 'start' : 'end'}
  dominantBaseline="central"
  fontSize="12"
>
({payload.count} students)
</text>
    </g>
  );
};
  // Add 3D effect with shadow and gradient - with percentage label
  const renderCustomizedShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index } = props;
    
    // Calculate the middle angle to position the percentage label
    const midAngle = (startAngle + endAngle) / 2;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    // Calculate percentage for the current segment
    const percentage = ((data[index].value / totalAmount) * 100).toFixed(1);
    
    return (
      <g>
        <defs>
          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fill} stopOpacity={1} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.8} />
          </linearGradient>
          <filter id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
            <feOffset result="offOut" in="SourceGraphic" dx="3" dy="3" />
            <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.5 0" />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={`url(#gradient-${index})`}
          filter={activeIndex === index ? null : `url(#shadow-${index})`}
        />
        <text 
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fill="#333"
          className="font-bold"
        >
          {percentage}%
        </text>
      </g>
    );
  };

  // If no data or all zeros, show a message
  if (data.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <p className="text-lg text-black-200">No fee data available to display</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto  rounded-lg p-4 lg:p-12 mb-12">
      <h2 className="text-xl font-bold text-center text-black-300  mb-6">Class Fee Collection Status</h2>
      <div className="text-center text-sm font-semibold text-black-300 mb-6">
        <div className="lg:flex lg:flex-row lg:justify-between lg:gap-4 flex flex-col gap-2 lg:mb-6 lg:mt-2 mt-6">
          <div className="bg-success-200 rounded-full py-1 px-4 lg:w-1/3 w-3/4 mx-auto lg:mt-2 mt-6">Total: ₹{totalAmount.toLocaleString()}</div>
          <div className="bg-lamaSky rounded-full py-1 px-4 lg:w-1/3 w-3/4 mx-auto lg:mt-2 mt-6">Paid: ₹{paidAmount.toLocaleString()|| 0}</div>
          <div className="bg-red-200 rounded-full py-1 px-4 lg:w-1/3 w-3/4 mx-auto lg:mt-2 mt-6">Unpaid: ₹{unpaidAmount.toLocaleString() || 0}</div>
        </div>
        <div className="lg:mt-2 mt-6">
          <div className="bg-lamaYellow rounded-full py-1 px-4 lg:w-1/3 w-3/4 mx-auto">Late Fees: ₹{lateFeeAmount_total.toLocaleString() || 0}</div>
        </div>
      </div>      
      
      <div className="h-80 lg:h-[400px] w-full overflow-x-scroll flex flex-row justify-center items-center">
        <ResponsiveContainer width="150%" height="100%" className="">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={window.innerWidth < 768 ? 70 : 90}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationBegin={0}
              animationDuration={1500}
              isAnimationActive={true}
              paddingAngle={1}
              shape={renderCustomizedShape}
              label={window.innerWidth < 768 ? null : renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  style={create3DEffect(COLORS[index % COLORS.length])}
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>    </div>
  );
};

export default StudentFeePieChart;