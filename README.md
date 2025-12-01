# Lunar View

Een moderne web applicatie voor het bekijken van real-time astronomische data (zon en maan) op basis van geografische locatie.

## 📋 Overzicht

Lunar View is een webapplicatie waarmee gebruikers eenvoudig zon- en maanstanden kunnen bekijken voor elke locatie ter wereld. De applicatie biedt real-time astronomische informatie inclusief zonsopkomst, zonsondergang, maanfasen, en meer.

## ✨ Functionaliteiten

- **Gebruikersbeheer**: Registratie en login met JWT authenticatie
- **Locatie Detectie**: Automatische GPS-detectie of handmatige locatie-invoer
- **Astronomische Data**: Real-time zon- en maandata (opkomst, ondergang, positie, afstand)
- **Favorieten**: Sla favoriete locaties op voor snelle toegang
- **Thema's**: Keuze uit Dark, Light en Cosmic thema's met auto-mode
- **Notificaties**: Browser notificaties voor astronomische updates
- **Responsive Design**: Werkt op desktop, tablet en mobiel
- **Wachtwoord Reset**: Herstel je wachtwoord via email

## 🛠️ Technologie Stack

### Frontend
- React 19
- Vite 7
- React Router DOM 6
- CSS Modules
- Axios
- Context API voor state management

### Backend
- Python 3.11
- FastAPI
- Motor (async MongoDB driver)
- JWT authenticatie
- Passlib (bcrypt)
- Pydantic

### Database
- MongoDB

### Externe APIs
- ipgeolocation.io (astronomische data)
- OpenStreetMap Nominatim (geocoding)

## 📁 Project Structuur

```
/app
├── backend/
│   ├── server.py          # FastAPI applicatie
│   ├── .env               # Environment variabelen
│   └── requirements.txt   # Python dependencies
│
└── web-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout/
    │   │   ├── LocationModal/
    │   │   └── ProtectedRoute.jsx
    │   ├── contexts/
    │   │   ├── AuthContext.jsx
    │   │   ├── ThemeContext.jsx
    │   │   └── NotificationContext.jsx
    │   ├── pages/
    │   │   ├── Home/
    │   │   ├── Login/
    │   │   ├── Register/
    │   │   ├── ResetPassword/
    │   │   ├── Favorites/
    │   │   └── Profile/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🚀 Installatie en Setup

### Vereisten
- Python 3.11+
- Node.js 18+
- MongoDB 7.0+

### Backend Setup

1. **Installeer Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configureer environment variabelen:**
   
   Maak een `.env` bestand in de `backend` map:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=lunar_view_db
   JWT_SECRET_KEY=your-secret-key-here
   ```

3. **Start de backend server:**
   ```bash
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

### Frontend Setup

1. **Installeer Node dependencies:**
   ```bash
   cd web-frontend
   npm install
   ```

2. **Configureer environment variabelen:**
   
   Maak een `.env` bestand in de `web-frontend` map:
   ```
   VITE_API_URL=http://localhost:8001
   ```

3. **Start de development server:**
   ```bash
   npm run dev
   ```

4. **Open de applicatie:**
   
   Navigeer naar `http://localhost:5173` in je browser

## 🔐 API Endpoints

### Authenticatie
- `POST /api/auth/register` - Registreer nieuwe gebruiker
- `POST /api/auth/login` - Login gebruiker
- `GET /api/auth/me` - Haal huidige gebruiker op
- `POST /api/auth/reset-password` - Reset wachtwoord

### Astronomie
- `GET /api/astronomy?lat={lat}&long={long}` - Haal astronomische data op voor locatie

### Favorieten
- `GET /api/favorites` - Haal alle favorieten op
- `POST /api/favorites` - Voeg favoriet toe
- `DELETE /api/favorites/{id}` - Verwijder favoriet

## 💡 Gebruik

1. **Registreer** een account of **log in** met bestaande credentials
2. **Sta locatietoegang toe** of selecteer handmatig een locatie
3. **Bekijk** real-time astronomische data voor je locatie
4. **Sla** interessante locaties op als favorieten
5. **Personaliseer** je ervaring met thema's en notificaties

## 🎨 Thema's

De applicatie biedt 3 visuele thema's:

- **Dark Mode**: Donkere achtergrond voor gebruik in de avond
- **Light Mode**: Lichte achtergrond voor overdag
- **Cosmic Mode**: Paarse ruimte-geïnspireerde kleuren
- **Auto Mode**: Volgt automatisch je systeem voorkeur

## 📱 Responsive Design

Lunar View is volledig responsive en werkt op:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Grote schermen (1440px+)

## 🔒 Beveiliging

- JWT token-based authenticatie
- Bcrypt password hashing
- CORS configuratie
- Input validatie via Pydantic
- Protected routes in frontend
- XSS bescherming

## 📊 Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "email": String,
  "password": String (hashed),
  "name": String,
  "created_at": DateTime
}
```

### Favorites Collection
```javascript
{
  "_id": ObjectId,
  "user_id": String,
  "location_name": String,
  "latitude": Float,
  "longitude": Float,
  "saved_at": DateTime
}
```

## 🐛 Bekende Issues

Geen bekende kritieke issues op dit moment.

## 🔄 Toekomstige Verbeteringen

- Email verificatie bij registratie
- Sociale media login (Google, Facebook)
- Maanfase kalender visualisatie
- Export functionaliteit voor data
- Meerdere talen ondersteuning
- PWA ondersteuning voor offline gebruik
- Dark sky map integratie
- Historische data grafieken

## 👨‍💻 Ontwikkelaar

Ontwikkeld door: Aniel-11

## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden.

## 📞 Contact & Support

Voor vragen of suggesties, open een issue in de repository.

---

**Versie:** 1.0  
**Laatste Update:** December 2024  
**Status:** Actief in ontwikkeling
