# 🌍 Carbon Footprint Calculator & Prediction System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An AI-driven carbon footprint calculator and prediction system that helps individuals understand and reduce their environmental impact. The system combines machine learning models with modern web technologies to provide accurate carbon footprint predictions and personalized recommendations.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Machine Learning](#-machine-learning)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## ✨ Features

### Core Features
- 🔐 **User Authentication**: Secure registration and login system with bcrypt password hashing
- 📊 **Carbon Footprint Calculator**: Calculate your carbon footprint based on lifestyle, energy consumption, and transportation
- 🤖 **AI-Powered Predictions**: Machine learning model with 95%+ accuracy for carbon footprint prediction
- 📈 **Dashboard**: Visualize your carbon footprint with interactive charts and graphs
- 💡 **Personalized Recommendations**: Get actionable suggestions to reduce your carbon footprint
- 📱 **Mobile App**: Flutter mobile application for iOS and Android
- 📊 **Historical Tracking**: Track your carbon footprint over time
- 🎯 **Gamification**: Earn points and badges for reducing your carbon footprint

### Advanced Features
- 🔍 **Real-time Calculations**: Instant carbon footprint calculations
- 📊 **Data Visualization**: Interactive charts using Chart.js and Recharts
- 🎨 **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- 🔒 **Secure API**: RESTful API with FastAPI and SQLAlchemy
- 📱 **Cross-Platform**: Web and mobile applications
- 🌐 **Deployment Ready**: Docker support and deployment configurations

## 🛠️ Tech Stack

### Frontend
- **React.js** 18.2.0 - UI library
- **Tailwind CSS** 3.4.18 - Styling
- **Chart.js** 3.8.0 - Data visualization
- **Recharts** 3.3.0 - Additional charts
- **React Router** 6.3.0 - Navigation
- **Axios** 0.27.2 - HTTP client
- **Framer Motion** 12.23.24 - Animations

### Backend
- **FastAPI** 0.104.1 - Python web framework
- **SQLAlchemy** 2.0.23 - ORM
- **PyMySQL** 1.1.0 - MySQL connector
- **Pydantic** 2.5.0 - Data validation
- **bcrypt** 4.0.1 - Password hashing
- **Uvicorn** 0.24.0 - ASGI server

### Machine Learning
- **Scikit-learn** 1.4.0 - ML library
- **XGBoost** 1.7.6 - Gradient boosting
- **LightGBM** 4.0.0 - Gradient boosting
- **Pandas** 2.1.0 - Data manipulation
- **NumPy** 1.25.0 - Numerical computing

### Database
- **MySQL** 8.0+ - Relational database

### Mobile
- **Flutter** - Cross-platform mobile framework

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
carbon-footprint/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core configurations
│   │   ├── database/       # Database connection
│   │   ├── ml/             # Machine learning models
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── requirements.txt    # Python dependencies
│   └── main.py            # FastAPI application
├── frontend/               # React.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── App.js         # Main App component
│   └── package.json       # Node dependencies
├── flutter/                # Flutter mobile app
│   ├── lib/               # Dart source files
│   └── pubspec.yaml       # Flutter dependencies
├── data/                   # Data files
│   ├── raw/               # Raw data
│   └── processed/         # Processed data
├── models/                 # Trained ML models
├── docs/                   # Documentation
├── presentation/           # Presentation materials
├── reports/                # Analysis reports
└── README.md              # This file
```

## 🚀 Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Flutter 3.0+ (for mobile app)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Keerthanac930/carbon-footprint.git
   cd carbon-footprint
   ```

2. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE carbon_footprint_db;
   ```

5. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=carbon_footprint_db
   SECRET_KEY=your_secret_key
   ```

6. **Run database migrations**
   ```bash
   python -m app.database.connection
   ```

7. **Start the backend server**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### Mobile App Setup

1. **Navigate to Flutter directory**
   ```bash
   cd flutter
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 📖 Usage

### Web Application

1. **Register a new account**
   - Navigate to `http://localhost:3000/signup`
   - Fill in your email, name, and password
   - Click "Create Account"

2. **Login**
   - Navigate to `http://localhost:3000/signin`
   - Enter your email and password
   - Click "Sign In"

3. **Calculate Carbon Footprint**
   - Fill in the carbon footprint calculator form
   - Provide information about your lifestyle, energy consumption, and transportation
   - Click "Calculate" to get your carbon footprint prediction

4. **View Dashboard**
   - Access your personalized dashboard
   - View your carbon footprint history
   - See recommendations for reducing your carbon footprint

### Mobile App

1. **Install the APK**
   - Download the APK from the releases
   - Install on your Android device
   - Or build from source using Flutter

2. **Use the app**
   - Register or login
   - Calculate your carbon footprint
   - View your dashboard and recommendations

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Carbon Footprint Endpoints

- `POST /api/carbon-footprint/calculate` - Calculate carbon footprint
- `GET /api/carbon-footprint/history` - Get carbon footprint history
- `GET /api/carbon-footprint/recommendations` - Get recommendations

### Prediction Endpoints

- `POST /api/predict` - Predict carbon footprint using ML model

### Interactive API Documentation

Once the backend is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🤖 Machine Learning

### Model Architecture

The system uses a **Random Forest** model trained on synthetic residential carbon data with 100+ features covering:
- Household characteristics
- Energy consumption
- Transportation habits
- Lifestyle choices

### Model Performance

- **Accuracy**: 95%+
- **R² Score**: 0.95+
- **Mean Absolute Error**: < 5%

### Training

To train the model:
```bash
cd backend/app/ml
python train_v3_minimal_updated.py
```

### Prediction

The model predicts carbon footprint in kg CO₂/year based on user input.

## 📸 Screenshots

### Web Application
- Dashboard with carbon footprint visualization
- Calculator form with step-by-step input
- Recommendations page with actionable suggestions

### Mobile App
- Login and registration screens
- Carbon footprint calculator
- Dashboard with charts and graphs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Follow ESLint rules for JavaScript code
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Keerthana C**

- GitHub: [@Keerthanac930](https://github.com/Keerthanac930)
- Profile: [https://github.com/Keerthanac930](https://github.com/Keerthanac930)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Special thanks to the open-source community for the amazing tools and libraries
- Inspiration from environmental science research and climate change awareness initiatives

## 📞 Contact

For questions or support, please open an issue on GitHub or contact the author.

---

**Made with ❤️ for a sustainable future**



