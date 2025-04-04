// client/src/pages/ReportsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReportFilters from '../components/reports/ReportFilters';
import BudgetStatusTable from '../components/reports/BudgetStatusTable';
import CategoryChart from '../components/reports/CategoryChart';
import reportService from '../services/reportService';
import Spinner from '../components/common/Spinner';
import { formatDateForInput } from '../utils/formatters';
import './ReportsPage.css'; // Create this CSS

const ReportsPage = () => {
    // Initialize filters (e.g., current month)
    const initialDate = new Date();
    const [filters, setFilters] = useState({
        period: 'Monthly',
        date: formatDateForInput(initialDate),
    });

    const [budgetStatusData, setBudgetStatusData] = useState(null);
    const [categorySummaryData, setCategorySummaryData] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [errorStatus, setErrorStatus] = useState('');
    const [errorCategory, setErrorCategory] = useState('');

    // Function to fetch reports based on current filters
    const fetchReports = useCallback(async (currentFilters) => {
        setLoadingStatus(true);
        setLoadingCategory(true);
        setErrorStatus('');
        setErrorCategory('');

        const params = {
             period: currentFilters.period,
             // Only include date if it's valid
             ...(currentFilters.date && { date: currentFilters.date })
        };

        try {
            const statusRes = await reportService.getBudgetStatus(params);
            if (statusRes.success) setBudgetStatusData(statusRes.data);
            else throw new Error(statusRes.message || 'Failed to load budget status');
        } catch (err) {
            setErrorStatus(err.message);
            setBudgetStatusData(null); // Clear data on error
            console.error("Error fetching budget status:", err);
        } finally {
            setLoadingStatus(false);
        }

        try {
            const categoryRes = await reportService.getSpendingByCategory(params);
             if (categoryRes.success) setCategorySummaryData(categoryRes.data);
            else throw new Error(categoryRes.message || 'Failed to load category summary');
        } catch (err) {
            setErrorCategory(err.message);
            setCategorySummaryData(null); // Clear data on error
            console.error("Error fetching category summary:", err);
        } finally {
            setLoadingCategory(false);
        }

    }, []); // No dependencies, relies on passed currentFilters


    // Fetch reports when filters change
    useEffect(() => {
        fetchReports(filters);
    }, [filters, fetchReports]); // Re-run when filters change

    // Handler for filter changes from ReportFilters component
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        // fetchReports is called by the useEffect above
    }, []); // Empty dependency array as it only sets state


     // Animation variants
     const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
     const sectionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };


    return (
        <motion.div
            className="reports-page-container"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h1 variants={sectionVariants}>Financial Reports</motion.h1>

            <motion.section className="report-filters-section" variants={sectionVariants}>
                 <ReportFilters onFilterChange={handleFilterChange} initialFilters={filters} />
             </motion.section>

            {/* Display spinner centrally if both are loading initially */}
             {(loadingStatus && loadingCategory && !budgetStatusData && !categorySummaryData) && <Spinner />}

            <motion.section className="report-section" variants={sectionVariants}>
                 <BudgetStatusTable reportData={budgetStatusData} loading={loadingStatus} error={errorStatus} />
            </motion.section>

            <motion.section className="report-section" variants={sectionVariants}>
                <CategoryChart reportData={categorySummaryData} loading={loadingCategory} error={errorCategory} />
             </motion.section>

        </motion.div>
    );
};

export default ReportsPage;