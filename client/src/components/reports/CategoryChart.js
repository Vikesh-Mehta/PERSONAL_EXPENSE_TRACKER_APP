// client/src/components/reports/CategoryChart.js
import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2'; // Or Pie
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title // Optional: Import Title if you want to use it
} from 'chart.js';
import './CategoryChart.css'; // Create this CSS

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Helper to generate distinct colors - can be improved
const generateColors = (numColors) => {
  const colors = [];
  const hueStep = 360 / numColors;
  for (let i = 0; i < numColors; i++) {
    // Use HSL for better color distribution
    colors.push(`hsl(${i * hueStep}, 70%, 60%)`);
  }
  return colors;
};


const CategoryChart = ({ reportData, loading, error }) => {

    if (loading) return <p className="report-message">Loading category summary...</p>;
    if (error) return <p className="report-message error">Error: {error}</p>;
     if (!reportData || reportData.length === 0) return <p className="report-message">No spending data available for this period.</p>;

    // Prepare data for Chart.js
    const chartData = {
        labels: reportData.map(item => item.category),
        datasets: [{
            label: 'Spending by Category',
            data: reportData.map(item => item.totalAmount),
             backgroundColor: generateColors(reportData.length), // Generate dynamic colors
            borderColor: '#ffffff', // White border for segments
            borderWidth: 1,
        }]
    };

    // Chart.js options (customize as needed)
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to fit container height
        plugins: {
            legend: {
                position: 'right', // Or 'bottom', 'left', 'top'
                labels: {
                     boxWidth: 15, // Smaller legend color boxes
                     padding: 15 // Spacing between legend items
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) label += ': ';
                        if (context.parsed !== null) {
                            // Format tooltip value as INR currency
                            label += context.parsed.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
                        }
                        return label;
                    }
                }
            },
             // Optional Title
             title: {
                 display: true,
                 text: 'Spending Breakdown by Category',
                 font: { size: 16 }
             }
        },
        cutout: '60%', // Makes it a Doughnut chart (set to 0 for Pie)
    };

     // Animation
    const chartVariants = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } } };


    return (
        <motion.div className="category-chart-container" variants={chartVariants}>
             {/* Removed h3 as it's now in chart options title */}
            <div className="chart-wrapper"> {/* Control chart size */}
                <Doughnut data={chartData} options={options} />
             </div>
        </motion.div>
    );
};

export default CategoryChart;