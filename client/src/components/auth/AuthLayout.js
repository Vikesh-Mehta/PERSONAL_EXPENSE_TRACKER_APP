// client/src/components/auth/AuthLayout.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaPiggyBank, FaChartLine, FaCoins } from 'react-icons/fa'; // Example icons
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delay: 0.1, duration: 0.5 }
        },
    };

    const iconVariants = (delay = 0) => ({
         initial: { y: -20, opacity: 0 },
         animate: {
             y: 0,
             opacity: 1,
             transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.5 + delay }
         },
         hover: {
             scale: 1.2,
             rotate: [0, 10, -10, 0],
             transition: { yoyo: Infinity, duration: 0.8 }
         }
     });

    return (
        <motion.div
            className="auth-layout-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="auth-graphic-side">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
                >
                    Personal Expense Tracker
                </motion.h1>
                <motion.p
                     initial={{ x: -50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ type: 'spring', stiffness: 120, delay: 0.4 }}
                     className="tagline"
                >
                    Take control of your finances, effortlessly.
                 </motion.p>

                 {/* Animated Icons */}
                <div className="animated-icons">
                    <motion.div variants={iconVariants(0)} initial="initial" animate="animate" whileHover="hover">
                         <FaPiggyBank size={50} className="icon piggy"/>
                    </motion.div>
                     <motion.div variants={iconVariants(0.2)} initial="initial" animate="animate" whileHover="hover">
                         <FaChartLine size={50} className="icon chart"/>
                    </motion.div>
                    <motion.div variants={iconVariants(0.4)} initial="initial" animate="animate" whileHover="hover">
                         <FaCoins size={50} className="icon coins"/>
                    </motion.div>
                </div>
            </div>
            <div className="auth-form-side">
                {children} {/* This is where AuthForm will be rendered */}
            </div>
        </motion.div>
    );
};

export default AuthLayout;