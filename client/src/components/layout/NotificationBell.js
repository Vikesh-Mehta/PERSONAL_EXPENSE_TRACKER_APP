// client/src/components/layout/NotificationBell.js
import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth'; // Use Auth context to get notifications
import { formatDateReadable } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationBell.css'; // Create this CSS

const NotificationBell = () => {
    const { unreadCount, notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleMarkRead = (e, id) => {
        e.stopPropagation(); // Prevent dropdown from closing
        markNotificationRead(id);
    };

     const handleMarkAll = (e) => {
        e.stopPropagation();
        markAllNotificationsRead();
        // Optionally close dropdown after short delay
        // setTimeout(() => setIsOpen(false), 300);
    };

    // Animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } }
    };
     const itemVariants = {
         hidden: { opacity: 0, x: -10 },
         visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="bell-button" title={`${unreadCount} unread notifications`}>
                <FaBell />
                {unreadCount > 0 && <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="notifications-dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className="dropdown-header">
                            <h4>Notifications</h4>
                            {notifications.length > 0 && (
                                <button onClick={handleMarkAll} className="mark-all-btn">
                                    <FaCheckDouble /> Mark All Read
                                </button>
                            )}
                         </div>
                        <ul className="notifications-list">
                            {notifications.length === 0 ? (
                                <li className="no-notifications">No unread notifications.</li>
                            ) : (
                                notifications.map(notif => (
                                    <motion.li
                                        key={notif._id}
                                        variants={itemVariants} // Apply item animation
                                        className={`notification-item ${notif.isRead ? 'read' : ''}`}
                                         onClick={(e) => handleMarkRead(e, notif._id)} // Mark read on click
                                    >
                                        <p className="message">{notif.message}</p>
                                        <span className="timestamp">{formatDateReadable(notif.createdAt)}</span>
                                         {/* Explicit button to mark read (alternative)
                                            <button onClick={(e) => handleMarkRead(e, notif._id)} className="mark-read-btn">Mark Read</button>
                                         */}
                                    </motion.li>
                                ))
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;