// client/src/services/notificationService.js
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/notifications/';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => { /* ... auth interceptor ... */ });

const getUnread = async () => {
    try { return (await api.get('/unread')).data; } // { success, count, totalUnread, data }
    catch (error) { console.error("Get unread notifications failed:", error); throw error; }
};
const markRead = async (id) => {
    try { return (await api.put(`/${id}/read`)).data; } // { success, data }
    catch (error) { console.error("Mark notification read failed:", error); throw error; }
};
const markAllRead = async () => {
    try { return (await api.put(`/readall`)).data; } // { success, message }
    catch (error) { console.error("Mark all notifications read failed:", error); throw error; }
};

const notificationService = { getUnread, markRead, markAllRead };
export default notificationService;