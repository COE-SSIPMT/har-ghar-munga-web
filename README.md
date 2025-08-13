# HarGhar Munga - Admin Panel

A modern, responsive admin panel frontend for the HarGhar Munga project built with React.js and Vite. Features a beautiful green-brown-white color scheme and comprehensive data management for students and Aanganwadi centers.

## 🌟 Features

### Pages & Functionality
- **Login Page**: Secure authentication with animated background and password visibility toggle
- **Dashboard**: Overview with statistics cards and interactive charts
- **Student Stats**: Comprehensive student data management with filtering and detailed views
- **Aanganwadi Stats**: Center management with capacity tracking and add new center functionality

### Design & UI
- Modern, responsive design with green-brown-white gradient theme
- Smooth animations and transitions
- Interactive charts using Recharts library
- Modal dialogs for detailed views and forms
- Mobile-friendly responsive layout

### Technical Features
- React 18 with functional components and hooks
- React Router for navigation
- Recharts for data visualization
- Pure CSS (no Tailwind) with modular stylesheets
- Vite for fast development and building

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Hargharmunga-web
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── assets/        # Images, logo, icons
├── components/    # Reusable UI components
│   ├── Sidebar.jsx
│   └── InfoBox.jsx
├── pages/         # Main application pages
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── StudentStats.jsx
│   └── AanganwadiStats.jsx
├── charts/        # Chart components
│   ├── PieChart.jsx
│   └── ColumnChart.jsx
├── styles/        # CSS files for each component/page
│   ├── App.css
│   ├── Login.css
│   ├── Dashboard.css
│   ├── Sidebar.css
│   ├── InfoBox.css
│   ├── Charts.css
│   ├── StudentStats.css
│   └── AanganwadiStats.css
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## 🎨 Color Scheme

The application uses a consistent green-brown-white theme:

- **Primary Green**: #2d5a27
- **Secondary Green**: #4a7c59
- **Light Green**: #6b8e23
- **Primary Brown**: #8b4513
- **Secondary Brown**: #8b5a3c
- **Light Brown**: #cd853f
- **White**: #ffffff
- **Light Gray**: #f5f5f5

## 📊 Demo Data

The application includes sample data for demonstration:

### Students
- Student records with health status tracking
- Multilingual support (Hindi names and status)
- Detailed student information including:
  - Personal details (name, age, DOB)
  - Family information (father, mother)
  - Physical measurements (height, weight)
  - Health status (स्वस्थ, सामान्य, कमज़ोर, बीमार)
  - Contact and address information

### Aanganwadi Centers
- Center information with capacity tracking
- Supervisor details and contact information
- Visual capacity indicators
- District and sector classification

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Authentication

Simple authentication system with:
- Username/password login
- Password visibility toggle
- Route protection for authenticated pages
- Logout functionality

## 📈 Charts & Visualization

Interactive charts powered by Recharts:
- **Pie Chart**: Distribution overview
- **Column Chart**: Monthly trends
- Animated chart rendering
- Custom tooltips and legends
- Theme-consistent styling

## 🎯 Future Enhancements

Potential improvements for production use:
- Backend API integration
- Real-time data updates
- Advanced filtering and search
- Data export functionality
- User role management
- Multilingual support expansion
- Advanced analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Created for the HarGhar Munga initiative to support administrative management of student and Aanganwadi center data.
