# Lunar View - Real-Time Astronomical Tracking Web Application

Een moderne React webapplicatie voor real-time astronomische tracking van zon en maan posities op basis van je locatie.

## 🌟 Features

- **User Authenticatie**: Registreren en inloggen met email en wachtwoord
- **Real-Time Astronomische Data**: Bekijk actuele zon en maan informatie
- **GPS Locatie Detectie**: Automatische locatiebepaling via browser geolocation
- **Favorite Locaties**: Sla je favoriete locaties op voor snelle toegang
- **Responsive Design**: Werkt op desktop, tablet en mobiel
- **Dark Theme**: Professioneel donker thema geoptimaliseerd voor astronomische content

## 🛠️ Tech Stack

- **Frontend**: React 18+ met Vite
- **Styling**: CSS Modules
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **External API**: ipgeolocation.io Astronomy API

## 📋 Vereisten

- Node.js (v18 of hoger)
- npm of yarn
- Python 3.9+
- MongoDB

## 🚀 Installatie

### 1. Clone de repository

```bash
git clone <repository-url>
cd lunar-view
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Start backend
python server.py
```

Backend draait op: http://localhost:8001

### 3. Frontend Setup

```bash
cd web-frontend
npm install

# Start development server
npm run dev
```

Frontend draait op: http://localhost:3000

## 📁 Project Structuur

```
lunar-view/
├── backend/
│   ├── server.py          # FastAPI backend
│   └── requirements.txt   # Python dependencies
│
└── web-frontend/
    ├── src/
    │   ├── components/   # Herbruikbare componenten
    │   ├── contexts/     # React Context (Auth)
    │   ├── pages/        # Pagina componenten
    │   └── App.jsx       # Main app component
    ├── vite.config.js
    └── package.json
```

## 🔑 API Endpoints

### Authenticatie
- `POST /api/auth/register` - Registreer nieuwe gebruiker
- `POST /api/auth/login` - Login gebruiker
- `GET /api/auth/me` - Haal huidige gebruiker op

### Astronomie
- `GET /api/astronomy?lat={lat}&long={long}` - Haal astronomische data op

### Favorites
- `GET /api/favorites` - Haal alle favorites op
- `POST /api/favorites` - Voeg favorite toe
- `DELETE /api/favorites/{id}` - Verwijder favorite

## 🎨 Styling

De applicatie gebruikt CSS Modules voor component-gebaseerde styling.

## 📱 Responsive Design

Werkt op mobile, tablet en desktop devices.

## 🌐 Browser Geolocation

De applicatie gebruikt de browser's Geolocation API om automatisch je locatie te bepalen.

## 👨‍💻 Auteur

Aniel-11
