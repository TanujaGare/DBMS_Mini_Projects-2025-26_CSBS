# Canteen Management System

A full-stack web application for managing canteen operations, including menu management, order tracking, and sales analytics.

## Features

- **Admin Authentication**: Secure login for canteen administrators
- **Menu Management**: Add, update, and delete menu items with prices and availability
- **Order Management**: Create, track, and update order status
- **Sales Dashboard**: View daily sales metrics and analytics
- **Real-time Updates**: Responsive UI with real-time data synchronization

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Static site (deployable on Vercel, Netlify, etc.)
- API integration with backend

### Backend
- Python 3.8+
- Flask - Web framework
- MongoDB - Database
- Flask-CORS - Cross-origin requests
- Flask-Bcrypt - Password hashing
- Gunicorn - Production server

## Project Structure

```
.
├── frontend/                 # Frontend application
│   ├── index.html           # Login page
│   ├── dashboard.html       # Admin dashboard
│   ├── menu.html            # Menu management
│   ├── orders.html          # Order management
│   ├── css/
│   │   └── style.css        # Styling
│   └── js/
│       └── app.js           # Frontend logic
│
├── backend/                  # Backend application
│   ├── app.py              # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile            # Deployment configuration
│   └── .env.example        # Environment variables template
│
├── vercel.json             # Vercel deployment config
├── .env.example            # Root environment template
└── DEPLOYMENT.md           # Deployment guide
```

## Quick Start

### Prerequisites
- Python 3.8+
- MongoDB (local or Atlas)
- Node.js (optional, for frontend development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrudulaalande/Canteen-Management.git
   cd Canteen-Management
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Create `.env` file in backend/**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/canteenDB
   FLASK_ENV=development
   PORT=5000
   ```

4. **Run Backend**
   ```bash
   python app.py
   ```

5. **Serve Frontend**
   - Open `frontend/index.html` in your browser, or
   - Use live server extension in VS Code

### Default Login
- **Email**: admin@canteen.com
- **Password**: admin123

## API Documentation

### Authentication
- **POST /login** - Admin login

### Menu Management
- **GET /menu** - Get all menu items
- **POST /menu** - Add new menu item
- **PUT /menu/<id>** - Update menu item
- **DELETE /menu/<id>** - Delete menu item

### Order Management
- **GET /orders** - Get all orders
- **POST /orders** - Create new order
- **PUT /orders/<id>** - Update order status

### Analytics
- **GET /sales/today** - Get today's sales data

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Links
- **Frontend**: Deploy to [Vercel](https://vercel.com)
- **Backend**: Deploy to [Railway](https://railway.app), [Heroku](https://heroku.com), or [Render](https://render.com)

## Environment Configuration

Copy `.env.example` to `.env` and update with your values:

```bash
# Backend
MONGO_URI=your_mongodb_connection_string
FLASK_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app

# Frontend
VITE_API_BASE_URL=https://your-backend-url.com
```

## Security

- Passwords are hashed using bcrypt
- CORS is configured for secure cross-origin requests
- Environment variables protect sensitive data
- MongoDB Atlas IP whitelist recommended

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

**Created by**: Mrudula Alande  
**Repository**: https://github.com/mrudulaalande/Canteen-Management
