# Personal Expense Tracker App (MERN Stack)


A comprehensive MERN stack application designed to help users manage their personal finances efficiently by tracking expenses, setting budgets, analyzing spending patterns, and receiving budget alerts.

## Screenshots


**Login/Register Page:**
![image](https://github.com/user-attachments/assets/a5368bb7-7d0b-47d3-ae46-a3e27be1e4ab)
![image](https://github.com/user-attachments/assets/304e9352-2e7c-4173-b866-36beced8c96f)



**Dashboard:**
![image](https://github.com/user-attachments/assets/2e80b3bf-2e1f-48a8-bcb5-4b945621c938)


**Budget Management Page:**
![image](https://github.com/user-attachments/assets/21359e47-7eab-414d-9954-f490f328e518)


**Reports Page:**
![image](https://github.com/user-attachments/assets/18ad62b6-186c-4944-b6b7-4732ac821992)


## Features

*   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and password hashing (bcryptjs).
*   **Expense Management:**
    *   Add, view, edit, and delete expenses.
    *   Categorize expenses using a predefined and customizable list.
    *   Include details like date, amount (INR formatted), description, vendor, notes, payment method.
    *   Optional fields for basic project tracking.
    *   Visual indicator for "Reimbursable" expenses.
    *   (Visual input for receipt links - upload not implemented).
*   **Budget Management:**
    *   Set monthly, quarterly, yearly, or weekly budgets per category.
    *   View current spending against budget limits.
    *   Visual progress bars for budget utilization.
    *   Edit and delete existing budgets.
*   **Reporting & Analysis:**
    *   Generate reports filtered by period (Month, Quarter, Year).
    *   View spending breakdown by category (Doughnut Chart).
    *   View Budget vs. Actual spending table, highlighting overspending.
*   **Notifications:**
    *   Backend logic triggers alerts when spending approaches (e.g., 80%) or exceeds budget limits.
    *   Frontend notification bell displaying unread count (via polling).
    *   Dropdown list to view and mark notifications as read.
*   **User Interface:**
    *   Clean, responsive design.
    *   Animated transitions and interactions using Framer Motion.
    *   Iconography using React Icons.
    *   Consistent color scheme via CSS Variables.
*   **Currency:** All financial values are handled and displayed in Indian Rupees (INR).

## Tech Stack

*   **Frontend:**
    *   React.js
    *   React Router DOM (v6)
    *   Axios (for API calls)
    *   Framer Motion (for animations)
    *   React Icons
    *   Chart.js & react-chartjs-2 (for charts)
    *   CSS3 (with CSS Variables)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Mongoose (ODM for MongoDB)
    *   MongoDB (Database)
    *   JSON Web Token (JWT for authentication)
    *   bcryptjs (for password hashing)
    *   Cors (for enabling cross-origin requests)
    *   Dotenv (for environment variables)
*   **Database:**
    *   MongoDB (Cloud Atlas recommended or local instance)

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js & npm:** Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended).
*   **MongoDB:**
    *   Set up a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available), OR
    *   Install MongoDB Community Edition locally from [mongodb.com](https://www.mongodb.com/try/download/community).
*   **Git:** (Optional, for cloning) Download from [git-scm.com](https://git-scm.com/).
*   **Code Editor:** Such as Visual Studio Code.

## Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url> expense-tracker-app
    cd expense-tracker-app
    ```
    (Or download the ZIP and extract it)

2.  **Set Up Backend (`server` directory):**
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create the environment variables file:
        *   Create a file named `.env` in the `server` directory.
        *   Add the necessary environment variables (see section below).

3.  **Set Up Frontend (`client` directory):**
    *   Navigate to the client directory (from the root `expense-tracker-app` folder):
        ```bash
        cd ../client
        # Or if you are in server/: cd ../client
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```

## Environment Variables

Create a `.env` file in the `server` directory and add the following variables, replacing the placeholder values:

```dotenv
# MongoDB Connection String (replace with your actual connection string)
MONGO_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database_name>?retryWrites=true&w=majority

# JWT Secret Key (Choose a strong, random string)
JWT_SECRET=YOUR_VERY_SECRET_RANDOM_STRING_REPLACE_THIS

# Port for the backend server (optional, defaults to 5001 if not set)
PORT=5001
