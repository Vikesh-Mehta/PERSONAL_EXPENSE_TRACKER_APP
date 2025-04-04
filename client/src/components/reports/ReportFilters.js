// client/src/components/reports/ReportFilters.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDateForInput } from '../../utils/formatters';
import './ReportFilters.css'; // Create this CSS

const ReportFilters = ({ onFilterChange, initialFilters }) => {
    const [period, setPeriod] = useState(initialFilters?.period || 'Monthly');
    // Use a controlled date input. Default to today or initial filter date.
     const [date, setDate] = useState(formatDateForInput(initialFilters?.date || new Date()));

    // Available periods for filtering
    const reportPeriods = ['Monthly', 'Yearly', 'Quarterly']; // Add more as needed

    // Notify parent component when filters change
    useEffect(() => {
         // Only call onFilterChange if it's defined
         if (onFilterChange) {
            onFilterChange({ period, date });
        }
         // Don't include onFilterChange in dependency array if it's stable via useCallback in parent
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, date]);

    const handlePeriodChange = (e) => setPeriod(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);

    // Animation
    const filterVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };


    return (
        <motion.div className="report-filters-container" variants={filterVariants}>
            <h4>Report Period</h4>
            <div className="filter-controls">
                <div className="filter-group">
                    <label htmlFor="reportPeriod">Period Type:</label>
                    <select id="reportPeriod" value={period} onChange={handlePeriodChange}>
                        {reportPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                {/* Show date picker, label might change based on period */}
                <div className="filter-group">
                    <label htmlFor="reportDate">
                        {period === 'Yearly' ? 'Year:' : (period === 'Quarterly' ? 'Quarter Starting In:' : 'Month/Year:')}
                     </label>
                    {/* Date input technically selects a day, but backend uses it to determine month/year/quarter */}
                    <input
                        type="date"
                        id="reportDate"
                        value={date}
                        onChange={handleDateChange}
                     />
                     <span className="date-hint">(Select any day within the desired {period.toLowerCase().replace('ly','')})</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportFilters;