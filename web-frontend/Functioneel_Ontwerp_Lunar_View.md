# Functioneel Ontwerp Document
## Lunar View - Real-Time Astronomical Tracking Web Application

**Versie:** 1.0  
**Datum:** 30 November 2024  
**Auteur:** Aniel-11  
**Status:** Definitief

---

## Inhoudsopgave

1. [Probleembeschrijving](#1-probleembeschrijving)
2. [Doelstellingen](#2-doelstellingen)
3. [Functionele Eisen](#3-functionele-eisen)
4. [Niet-Functionele Eisen](#4-niet-functionele-eisen)
5. [Use Case Diagrammen](#5-use-case-diagrammen)
6. [Use Case Tabellen](#6-use-case-tabellen)
7. [Wireframes](#7-wireframes)
8. [Schermontwerpen](#8-schermontwerpen)
9. [Technische Architectuur](#9-technische-architectuur)
10. [Data Model](#10-data-model)

---

## 1. Probleembeschrijving

### 1.1 Context
Veel mensen zijn geïnteresseerd in astronomische fenomenen zoals zon- en maanstanden, maar hebben geen gemakkelijke manier om real-time informatie over deze fenomenen te verkrijgen op basis van hun specifieke locatie.

### 1.2 Probleem
Er ontbreekt een gebruiksvriendelijke webapplicatie die:
- Real-time astronomische data toont voor zon en maan
- Locatie-gebaseerde informatie biedt
- Gebruikers hun favoriete locaties laat opslaan
- Een moderne, responsieve interface heeft
- Personalisatie mogelijkheden biedt (thema's, notificaties)

### 1.3 Doelgroep
- Astronomielijhebbers
- Fotografen (golden hour planning)
- Zeilers en buitensporters
- Educatieve doeleinden
- Algemeen publiek met interesse in astronomie

---

## 2. Doelstellingen

### 2.1 Hoofddoelstelling
Een webapplicatie ontwikkelen waarmee gebruikers eenvoudig real-time astronomische informatie kunnen raadplegen voor elke locatie ter wereld.

### 2.2 Specifieke Doelstellingen
1. Gebruikers kunnen zich registreren en inloggen
2. Real-time zon- en maandata tonen op basis van GPS locatie
3. Mogelijkheid om handmatig locaties te selecteren
4. Favoriete locaties kunnen opslaan
5. Personalisatie door verschillende thema's
6. Notificaties voor astronomische events

---

## 3. Functionele Eisen

### FR-01: Gebruikersbeheer
**Prioriteit:** Hoog  
**Beschrijving:** Het systeem moet gebruikers in staat stellen om een account aan te maken en in te loggen.

**Acceptatiecriteria:**
- Gebruiker kan registreren met email en wachtwoord
- Gebruiker kan optioneel een naam opgeven
- Wachtwoord moet minimaal 6 karakters bevatten
- Systeem valideert email format
- Bij succesvolle login wordt JWT token uitgegeven
- Token wordt opgeslagen in localStorage

### FR-02: Locatie Detectie (GPS)
**Prioriteit:** Hoog  
**Beschrijving:** Het systeem moet automatisch de locatie van de gebruiker kunnen detecteren via browser geolocation.

**Acceptatiecriteria:**
- Systeem vraagt toestemming voor locatietoegang
- Bij goedkeuring wordt GPS locatie opgehaald
- Coördinaten worden getoond aan gebruiker
- Reverse geocoding toont plaatsnaam
- Foutafhandeling bij geweigerde toegang

### FR-03: Handmatige Locatie Selectie
**Prioriteit:** Hoog  
**Beschrijving:** Gebruikers moeten handmatig een locatie kunnen selecteren via coördinaten of plaatsnaam.

**Acceptatiecriteria:**
- Modal interface met twee tabs: Coördinaten en Plaatsnaam
- Coördinaten tab accepteert latitude (-90 tot 90) en longitude (-180 tot 180)
- Plaatsnaam tab zoekt via OpenStreetMap Nominatim API
- Validatie op invoer
- Foutmeldingen bij ongeldige data
- Succesvolle selectie sluit modal en update data

### FR-04: Astronomische Data Weergave
**Prioriteit:** Hoog  
**Beschrijving:** Het systeem toont real-time astronomische data voor zon en maan.

**Acceptatiecriteria:**
- Data wordt opgehaald van ipgeolocation.io API
- Zon data: status, sunrise, sunset, solar noon, day length, altitude, azimuth
- Maan data: status, moonrise, moonset, altitude, azimuth, distance
- Data wordt getoond in kaartweergave
- Datum en tijd worden prominent getoond
- Data refresht bij locatiewijziging

### FR-05: Favorieten Beheer
**Prioriteit:** Gemiddeld  
**Beschrijving:** Gebruikers kunnen locaties opslaan als favorieten.

**Acceptatiecriteria:**
- "Save Location" knop in Home scherm
- Huidige locatie wordt opgeslagen met naam en coördinaten
- Favorieten worden opgeslagen in database
- Favorieten scherm toont lijst van opgeslagen locaties
- Gebruiker kan favorieten verwijderen
- Confirmatie bij verwijderen

### FR-06: Theme Personalisatie
**Prioriteit:** Laag  
**Beschrijving:** Gebruikers kunnen kiezen uit verschillende thema's.

**Acceptatiecriteria:**
- 3 thema opties: Dark, Light, Cosmic
- Visual theme selector in Profile
- Active theme krijgt indicator
- Auto-theme optie volgt systeem voorkeur
- Theme keuze wordt opgeslagen in localStorage
- Smooth transitions tussen thema's

### FR-07: Notificaties
**Prioriteit:** Laag  
**Beschrijving:** Gebruikers kunnen browser notificaties ontvangen voor astronomische updates.

**Acceptatiecriteria:**
- Toggle switch in Profile
- Permission request bij activering
- Test notificatie functionaliteit
- Notificaties bij data refresh (sunset/sunrise info)
- Disabled state bij geweigerde permissions
- Error handling

### FR-08: Data Refresh
**Prioriteit:** Hoog  
**Beschrijving:** Gebruikers kunnen astronomische data verversen.

**Acceptatiecriteria:**
- Refresh knop in header
- Pull-to-refresh op mobile
- Loading indicator tijdens refresh
- Error handling bij mislukte requests
- Success feedback

---

## 4. Niet-Functionele Eisen

### NFR-01: Performance
- Pagina laadtijd < 3 seconden
- API response tijd < 2 seconden
- Smooth animations (60 FPS)

### NFR-02: Usability
- Intuïtieve interface zonder handleiding
- Duidelijke feedback bij acties
- Toegankelijk voor kleurenblinden
- Touch-friendly buttons (min 44x44px)

### NFR-03: Responsive Design
- Volledig responsive van 320px tot 4K
- Mobile-first design approach
- Breakpoints: 768px (tablet), 1024px (desktop)

### NFR-04: Browser Compatibility
- Chrome/Edge (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Mobile browsers (iOS Safari, Chrome Mobile)

### NFR-05: Security
- JWT token authenticatie
- HTTPS vereist in productie
- Password hashing (bcrypt)
- XSS/CSRF bescherming
- Input validatie

### NFR-06: Betrouwbaarheid
- 99% uptime
- Graceful error handling
- Fallback bij API failures
- Data persistentie

### NFR-07: Schaalbaarheid
- Ondersteuning voor 1000+ gelijktijdige gebruikers
- Database indexering
- API rate limiting

---

## 5. Use Case Diagrammen

```
                    Lunar View System
                    
    ┌─────────────────────────────────────────┐
    │                                         │
    │    ┌──────────┐                         │
    │    │Registreren│                        │
    │    └──────────┘                         │
    │          │                              │
┌───────┐     │      ┌──────────┐            │
│       │◄────┼──────►│ Inloggen │            │
│Gebruiker    │      └──────────┘            │
│       │◄────┼────────────┐                 │
└───────┘     │            │                 │
              │      ┌─────▼──────────┐      │
              │      │Bekijk Astro    │      │
              │      │Data            │      │
              │      └────────────────┘      │
              │            │                 │
              │      ┌─────▼──────────┐      │
              └──────►│Selecteer      │      │
                     │Locatie         │      │
                     └────────────────┘      │
                           │                 │
                     ┌─────▼──────────┐      │
                     │Opslaan         │      │
                     │Favoriet        │      │
                     └────────────────┘      │
                           │                 │
                     ┌─────▼──────────┐      │
                     │Wijzig Thema    │      │
                     └────────────────┘      │
                           │                 │
                     ┌─────▼──────────┐      │
                     │Notificaties    │      │
                     │Beheren         │      │
                     └────────────────┘      │
    └─────────────────────────────────────────┘
```

---

## 6. Use Case Tabellen

### UC-01: Gebruiker Registreren

| **Use Case ID** | UC-01 |
|---|---|
| **Use Case Naam** | Gebruiker Registreren |
| **Actor** | Nieuwe Gebruiker |
| **Prioriteit** | Hoog |
| **Precondities** | - Gebruiker heeft geen bestaand account<br>- Systeem is bereikbaar |
| **Postcondities** | - Account is aangemaakt<br>- Gebruiker is ingelogd<br>- JWT token is uitgegeven |
| **Basis Flow** | 1. Gebruiker navigeert naar register pagina<br>2. Systeem toont registratie formulier<br>3. Gebruiker vult email en wachtwoord in<br>4. Gebruiker klikt op "Register"<br>5. Systeem valideert invoer<br>6. Systeem maakt account aan<br>7. Systeem logt gebruiker in<br>8. Systeem redirect naar home |
| **Alternatieve Flow** | **3a. Email al in gebruik**<br>- Systeem toont error "Email already registered"<br>- Gebruiker kan andere email proberen<br><br>**3b. Wachtwoord te kort**<br>- Systeem toont error "Password must be at least 6 characters"<br>- Gebruiker moet langer wachtwoord invoeren<br><br>**3c. Wachtwoorden komen niet overeen**<br>- Systeem toont error "Passwords do not match"<br>- Gebruiker moet wachtwoorden opnieuw invoeren |
| **Uitzonderingen** | - Geen internetverbinding<br>- Server niet bereikbaar<br>- Database error |

---

### UC-02: Inloggen

| **Use Case ID** | UC-02 |
|---|---|
| **Use Case Naam** | Gebruiker Inloggen |
| **Actor** | Geregistreerde Gebruiker |
| **Prioriteit** | Hoog |
| **Precondities** | - Gebruiker heeft account<br>- Gebruiker is niet ingelogd |
| **Postcondities** | - Gebruiker is ingelogd<br>- JWT token opgeslagen<br>- Redirect naar home |
| **Basis Flow** | 1. Gebruiker navigeert naar login pagina<br>2. Systeem toont login formulier<br>3. Gebruiker vult email en wachtwoord in<br>4. Gebruiker klikt op "Login"<br>5. Systeem valideert credentials<br>6. Systeem geeft JWT token uit<br>7. Systeem redirect naar home |
| **Alternatieve Flow** | **5a. Onjuiste credentials**<br>- Systeem toont error "Incorrect email or password"<br>- Gebruiker kan opnieuw proberen |
| **Uitzonderingen** | - Geen internetverbinding<br>- Server error |

---

### UC-03: Astronomische Data Bekijken

| **Use Case ID** | UC-03 |
|---|---|
| **Use Case Naam** | Astronomische Data Bekijken |
| **Actor** | Ingelogde Gebruiker |
| **Prioriteit** | Hoog |
| **Precondities** | - Gebruiker is ingelogd<br>- Locatie is bepaald |
| **Postcondities** | - Astronomische data is zichtbaar<br>- Data is real-time |
| **Basis Flow** | 1. Systeem detecteert GPS locatie<br>2. Gebruiker geeft toestemming<br>3. Systeem haalt coördinaten op<br>4. Systeem doet reverse geocoding<br>5. Systeem haalt astronomische data op van API<br>6. Systeem toont zon data<br>7. Systeem toont maan data<br>8. Systeem toont datum en tijd |
| **Alternatieve Flow** | **2a. Toestemming geweigerd**<br>- Systeem toont error message<br>- Systeem biedt handmatige selectie aan<br><br>**5a. API call faalt**<br>- Systeem toont error<br>- Gebruiker kan retry doen |
| **Uitzonderingen** | - GPS niet beschikbaar<br>- API rate limit<br>- Geen internet |

---

### UC-04: Locatie Handmatig Selecteren

| **Use Case ID** | UC-04 |
|---|---|
| **Use Case Naam** | Locatie Handmatig Selecteren |
| **Actor** | Ingelogde Gebruiker |
| **Prioriteit** | Hoog |
| **Precondities** | - Gebruiker is ingelogd |
| **Postcondities** | - Nieuwe locatie is geselecteerd<br>- Astronomische data is geüpdatet |
| **Basis Flow** | 1. Gebruiker klikt "Select Location"<br>2. Systeem toont modal<br>3. Gebruiker kiest tab (Coordinates/City)<br>4. Gebruiker vult data in<br>5. Gebruiker klikt "Select Location"<br>6. Systeem valideert invoer<br>7. Systeem haalt nieuwe astronomische data op<br>8. Systeem sluit modal<br>9. Systeem update UI met nieuwe data |
| **Alternatieve Flow** | **Coordinates Tab:**<br>**6a. Ongeldige coördinaten**<br>- Systeem toont validation error<br>- Gebruiker corrigeert invoer<br><br>**City Tab:**<br>**6b. Stad niet gevonden**<br>- Systeem toont error "City not found"<br>- Gebruiker probeert andere naam |
| **Uitzonderingen** | - Geocoding API error<br>- Astronomy API error |

---

### UC-05: Locatie Opslaan als Favoriet

| **Use Case ID** | UC-05 |
|---|---|
| **Use Case Naam** | Locatie Opslaan als Favoriet |
| **Actor** | Ingelogde Gebruiker |
| **Prioriteit** | Gemiddeld |
| **Precondities** | - Gebruiker is ingelogd<br>- Locatie is geselecteerd |
| **Postcondities** | - Locatie is opgeslagen<br>- Zichtbaar in Favorites |
| **Basis Flow** | 1. Gebruiker bekijkt astronomische data<br>2. Gebruiker klikt "Save Location"<br>3. Systeem haalt huidige locatie op<br>4. Systeem slaat locatie op in database<br>5. Systeem toont success message |
| **Alternatieve Flow** | **4a. Locatie al opgeslagen**<br>- Systeem toont waarschuwing<br>- Gebruiker kan overschrijven of annuleren |
| **Uitzonderingen** | - Database error<br>- Geen internetverbinding |

---

### UC-06: Favorieten Beheren

| **Use Case ID** | UC-06 |
|---|---|
| **Use Case Naam** | Favorieten Bekijken en Verwijderen |
| **Actor** | Ingelogde Gebruiker |
| **Prioriteit** | Gemiddeld |
| **Precondities** | - Gebruiker is ingelogd |
| **Postcondities** | - Favorieten zijn zichtbaar<br>- Verwijderde items zijn uit database |
| **Basis Flow** | 1. Gebruiker navigeert naar Favorites<br>2. Systeem haalt favorieten op<br>3. Systeem toont lijst<br>4. Gebruiker klikt delete bij item<br>5. Systeem toont confirmatie<br>6. Gebruiker bevestigt<br>7. Systeem verwijdert uit database<br>8. Systeem update UI |
| **Alternatieve Flow** | **6a. Gebruiker annuleert**<br>- Systeem sluit confirmatie<br>- Item blijft behouden |
| **Uitzonderingen** | - Database error<br>- Item al verwijderd |

---

### UC-07: Thema Wijzigen

| **Use Case ID** | UC-07 |
|---|---|
| **Use Case Naam** | Applicatie Thema Wijzigen |
| **Actor** | Ingelogde Gebruiker |
| **Prioriteit** | Laag |
| **Precondities** | - Gebruiker is ingelogd |
| **Postcondities** | - Nieuw thema is actief<br>- Keuze opgeslagen in localStorage |
| **Basis Flow** | 1. Gebruiker navigeert naar Profile<br>2. Gebruiker ziet theme selector<br>3. Gebruiker klikt op thema (Dark/Light/Cosmic)<br>4. Systeem past CSS variables aan<br>5. UI update met smooth transition<br>6. Systeem slaat keuze op |
| **Alternatieve Flow** | **3a. Auto-theme activeren**<br>- Gebruiker zet checkbox aan<br>- Systeem detecteert OS voorkeur<br>- Systeem past thema aan |
| **Uitzonderingen** | - localStorage vol |

---

### UC-08: Notificaties Beheren

| **Use Case ID** | UC-08 |
|---|---|
| **Use Case Naam** | Browser Notificaties In-/Uitschakelen |
| **Actor** | Ingelogde Gebruiker |
| **Prioriteit** | Laag |
| **Precondities** | - Gebruiker is ingelogd<br>- Browser ondersteunt notificaties |
| **Postcondities** | - Notificaties aan/uit<br>- Permissions toegekend/ingetrokken |
| **Basis Flow** | 1. Gebruiker navigeert naar Profile<br>2. Gebruiker ziet notification toggle<br>3. Gebruiker klikt toggle<br>4. Systeem vraagt browser permission<br>5. Gebruiker accepteert<br>6. Systeem stuurt test notificatie<br>7. Systeem slaat voorkeur op |
| **Alternatieve Flow** | **5a. Permission denied**<br>- Systeem toont error message<br>- Toggle blijft uit<br>- Instructie om permissions te wijzigen in browser<br><br>**3a. Uitschakelen**<br>- Systeem zet notificaties uit<br>- Systeem update localStorage |
| **Uitzonderingen** | - Browser ondersteunt geen notificaties |

---

## 7. Wireframes

### 7.1 Login Scherm

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                  [LUNAR VIEW LOGO]                  │
│                   (200x200px)                       │
│                                                     │
│                   LUNAR VIEW                        │
│          Real-Time Astronomical Tracking            │
│                                                     │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │  Email                                  │    │
│     │  ┌───────────────────────────────────┐ │    │
│     │  │ Enter your email                  │ │    │
│     │  └───────────────────────────────────┘ │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │  Password                               │    │
│     │  ┌───────────────────────────────────┐ │    │
│     │  │ Enter your password               │ │    │
│     │  └───────────────────────────────────┘ │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│              ┌─────────────────────┐               │
│              │       Login         │               │
│              └─────────────────────┘               │
│                                                     │
│          Don't have an account? Register            │
│                                                     │
└─────────────────────────────────────────────────────┘

Kleuren:
- Achtergrond: #0f1729 (dark blue)
- Card: #1a2540 (lighter blue)
- Borders: #2a3a6b
- Button: #6B7AFF (primary blue)
- Text: #ffffff, #A5B4FF
```

---

### 7.2 Register Scherm

```
┌─────────────────────────────────────────────────────┐
│              [LUNAR VIEW LOGO]                      │
│               (150x150px)                           │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │  Name (Optional)                        │    │
│     │  └───────────────────────────────────┘  │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │  Email *                                │    │
│     │  └───────────────────────────────────┘  │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │  Password *                             │    │
│     │  └───────────────────────────────────┘  │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │  Confirm Password *                     │    │
│     │  └───────────────────────────────────┘  │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│              ┌─────────────────────┐               │
│              │      Register       │               │
│              └─────────────────────┘               │
│                                                     │
│         Already have an account? Login              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 7.3 Home Scherm (Dashboard)

```
┌──────────────────────────────────────────────────────────────┐
│ ┌────┐  📍 Amsterdam, Netherlands                            │
│ │LOGO│                                                        │
│ └────┘  [🗺️ Select] [⭐ Save] [🔄 Refresh]                  │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │              2024-11-30                                │  │
│  │              14:30:45                                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐       │
│  │  ☀️ Sun             │    │  🌙 Moon            │       │
│  │  ───────────────     │    │  ───────────────     │       │
│  │  Status: Daylight    │    │  Status: Below       │       │
│  │  Sunrise: 08:23      │    │  Moonrise: 19:45     │       │
│  │  Sunset: 16:47       │    │  Moonset: 08:12      │       │
│  │  Solar Noon: 12:35   │    │  Altitude: -15.2°    │       │
│  │  Day Length: 8:24    │    │  Azimuth: 234.5°     │       │
│  │  Altitude: 23.4°     │    │  Distance: 384400 km │       │
│  │  Azimuth: 180.2°     │    │                      │       │
│  └──────────────────────┘    └──────────────────────┘       │
│                                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐                        │
│  │ 🏠 Home│  │⭐Favs  │  │👤Prof  │                        │
│  └────────┘  └────────┘  └────────┘                        │
└──────────────────────────────────────────────────────────────┘

Desktop (1920px):
- Header sticky top
- Cards side-by-side (2 columns)
- Max width: 1200px centered

Tablet (768px):
- Cards stack (1 column)
- Buttons wrap

Mobile (< 768px):
- Full width
- Buttons full width
- Larger touch targets
```

---

### 7.4 Location Modal

```
┌──────────────────────────────────────────┐
│  Select Location                      [×]│
├──────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────────┐   │
│  │📍Coordinates │  │ 🏙️ City Name  │   │
│  └──────────────┘  └────────────────┘   │
├──────────────────────────────────────────┤
│                                          │
│  [Coordinates Tab Active]                │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Latitude                          │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │ e.g., 52.3676                │ │ │
│  │  └──────────────────────────────┘ │ │
│  │  Range: -90 to 90                │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Longitude                         │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │ e.g., 4.9041                 │ │ │
│  │  └──────────────────────────────┘ │ │
│  │  Range: -180 to 180              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌───────────┐  ┌──────────────────────┐│
│  │  Cancel   │  │  Select Location     ││
│  └───────────┘  └──────────────────────┘│
└──────────────────────────────────────────┘

[City Name Tab]:
┌──────────────────────────────────────────┐
│  ┌────────────────────────────────────┐ │
│  │  City Name                         │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │ Amsterdam, Netherlands       │ │ │
│  │  └──────────────────────────────┘ │ │
│  │  Enter city name or address      │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘

Interaction:
1. Modal opens centered on screen
2. Tab switching
3. Input validation real-time
4. Search on submit
5. Error messages in-place
```

---

### 7.5 Favorites Scherm

```
┌──────────────────────────────────────────────────────┐
│  ⭐ Favorite Locations                               │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📍  Amsterdam, Netherlands                     │ │
│  │     52.3676, 4.9041                            │ │
│  │                                  [🗑️ Delete]  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📍  New York, USA                              │ │
│  │     40.7128, -74.0060                          │ │
│  │                                  [🗑️ Delete]  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📍  Tokyo, Japan                               │ │
│  │     35.6762, 139.6503                          │ │
│  │                                  [🗑️ Delete]  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [Empty State]:                                     │
│  ┌────────────────────────────────────────────────┐ │
│  │              ⭐ (large icon)                   │ │
│  │       No favorite locations yet                │ │
│  │  Save locations from home to view them here   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐               │
│  │ 🏠 Home│  │⭐Favs  │  │👤Prof  │               │
│  └────────┘  └────────┘  └────────┘               │
└──────────────────────────────────────────────────────┘
```

---

### 7.6 Profile Scherm

```
┌──────────────────────────────────────────────────────┐
│  Profile                                             │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐ │
│  │                   👤                           │ │
│  │              (80x80 avatar)                    │ │
│  │                                                │ │
│  │               John Doe                         │ │
│  │           john@example.com                     │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  🎨 Theme Settings                                   │
│  ┌────────────────────────────────────────────────┐ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐          │ │
│  │  │🌙 Dark │  │☀️Light│  │🌌Cosmic│          │ │
│  │  │   ✓    │  │        │  │        │          │ │
│  │  └────────┘  └────────┘  └────────┘          │ │
│  │                                                │ │
│  │  ☑ Auto theme (follow system preference)     │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  🔔 Notifications                                    │
│  ┌────────────────────────────────────────────────┐ │
│  │  Browser Notifications                         │ │
│  │  Get alerts for astronomical events            │ │
│  │                                                │ │
│  │  Enable Notifications          [Toggle: ON]   │ │
│  │                                                │ │
│  │  [🧪 Send Test Notification]                  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ⚙️ Settings                                         │
│  ┌────────────────────────────────────────────────┐ │
│  │  ℹ️ About Lunar View                       >  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │            🚪 Logout                           │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│              Lunar View v1.0.0                      │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐               │
│  │ 🏠 Home│  │⭐Favs  │  │👤Prof  │               │
│  └────────┘  └────────┘  └────────┘               │
└──────────────────────────────────────────────────────┘
```

---

## 8. Schermontwerpen

### 8.1 Design Principes

**Kleurenpalet:**

**Dark Theme (Default):**
- Background: #0f1729
- Card Background: #1a2540
- Borders: #2a3a6b
- Primary: #6B7AFF
- Text Primary: #ffffff
- Text Secondary: #A5B4FF
- Text Tertiary: #7B8FFF

**Light Theme:**
- Background: #f5f7fa
- Card Background: #ffffff
- Borders: #e1e8ed
- Primary: #4f5fd8
- Text Primary: #1a1a1a
- Text Secondary: #4a5568
- Text Tertiary: #718096

**Cosmic Theme:**
- Background: #0a0118
- Card Background: #1a0f2e
- Borders: #3d2b5f
- Primary: #a855f7
- Text Primary: #ffffff
- Text Secondary: #c4b5fd
- Text Tertiary: #9333ea

**Typografie:**
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- Headings: 24px - 32px, Bold
- Body: 16px, Regular
- Small: 14px
- Line Height: 1.5

**Spacing:**
- Base unit: 8px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

**Border Radius:**
- Small: 8px
- Medium: 12px
- Large: 16px

---

### 8.2 Component Specificaties

**Buttons:**
```
Primary Button:
- Background: #6B7AFF
- Color: #0f1729
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600
- Hover: brightness(1.1), translateY(-2px)
- Transition: 0.3s ease

Secondary Button:
- Background: transparent
- Border: 1px solid #2a3a6b
- Color: #A5B4FF
- Same dimensions as primary

Danger Button:
- Background: #FF6B6B
- Color: #ffffff
```

**Input Fields:**
```
Text Input:
- Background: #1a2540
- Border: 1px solid #2a3a6b
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px
- Color: #ffffff
- Placeholder: #7B8FFF
- Focus: border #6B7AFF, shadow 0 0 0 3px rgba(107,122,255,0.1)
```

**Cards:**
```
Standard Card:
- Background: #1a2540
- Border: 1px solid #2a3a6b
- Border Radius: 16px
- Padding: 24px
- Box Shadow: none
- Hover: translateY(-5px), shadow 0 10px 30px rgba(107,122,255,0.2)
- Transition: 0.3s ease
```

**Navigation:**
```
Bottom Navigation (Mobile):
- Position: fixed bottom
- Height: 64px
- Background: #1a2540
- Border Top: 1px solid #2a3a6b
- Icons: 24px
- Active Color: #6B7AFF
- Inactive Color: #A5B4FF

Top Navigation (Desktop):
- Position: sticky top
- Height: 80px
- Horizontal layout
- Logo left, links right
```

---

### 8.3 Responsive Breakpoints

**Mobile (< 768px):**
- Single column layout
- Full width cards
- Stack all elements vertically
- Bottom navigation
- Touch targets min 44x44px
- Font scale: 0.9x

**Tablet (768px - 1024px):**
- 2 column grid where applicable
- Sidebar navigation
- Adaptive card sizing

**Desktop (> 1024px):**
- Max width: 1200px centered
- Multi-column grids
- Hover states active
- More whitespace

---

## 9. Technische Architectuur

### 9.1 System Architectuur

```
┌─────────────────┐
│   Browser       │
│   (React SPA)   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Vite Dev      │
│   Server :3000  │
└────────┬────────┘
         │ API Proxy
         ▼
┌─────────────────┐
│   FastAPI       │
│   Backend :8001 │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌───────────────┐
│MongoDB │ │ ipgeolocation │
│ :27017 │ │     API       │
└────────┘ └───────────────┘
```

### 9.2 Tech Stack

**Frontend:**
- React 18+
- Vite (build tool)
- React Router DOM v6
- CSS Modules
- Axios (HTTP client)
- Context API (state management)

**Backend:**
- FastAPI (Python)
- Motor (async MongoDB driver)
- JWT authentication
- Pydantic (validation)
- Passlib (password hashing)
- httpx (async HTTP)

**Database:**
- MongoDB
- Collections: users, favorites

**External APIs:**
- ipgeolocation.io (astronomy data)
- OpenStreetMap Nominatim (geocoding)
- Browser Geolocation API
- Browser Notification API

### 9.3 Folder Structuur

```
web-frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.module.css
│   │   ├── ProtectedRoute/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ProtectedRoute.module.css
│   │   └── LocationModal/
│   │       ├── LocationModal.jsx
│   │       └── LocationModal.module.css
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.module.css
│   │   ├── Register/
│   │   │   ├── Register.jsx
│   │   │   └── Register.module.css
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.module.css
│   │   ├── Favorites/
│   │   │   ├── Favorites.jsx
│   │   │   └── Favorites.module.css
│   │   └── Profile/
│   │       ├── Profile.jsx
│   │       └── Profile.module.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md

backend/
├── server.py
├── requirements.txt
└── .env
```

---

## 10. Data Model

### 10.1 Database Schema

**Users Collection:**
```json
{
  "_id": ObjectId,
  "email": String (unique, required),
  "password": String (hashed, required),
  "name": String (optional),
  "created_at": DateTime (default: now)
}
```

**Favorites Collection:**
```json
{
  "_id": ObjectId,
  "user_id": String (reference to User._id, required),
  "location_name": String (required),
  "latitude": Float (required, -90 to 90),
  "longitude": Float (required, -180 to 180),
  "saved_at": DateTime (default: now)
}
```

### 10.2 API Endpoints

**Authentication:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

**Astronomy:**
- GET /api/astronomy?lat={lat}&long={long}

**Favorites:**
- GET /api/favorites
- POST /api/favorites
- DELETE /api/favorites/{id}

### 10.3 Frontend State Management

**Context Providers:**

1. **AuthContext:**
   - user: User object
   - token: JWT token string
   - loading: boolean
   - login(email, password): function
   - register(email, password, name): function
   - logout(): function

2. **ThemeContext:**
   - theme: 'dark' | 'light' | 'cosmic'
   - autoTheme: boolean
   - changeTheme(theme): function
   - toggleAutoTheme(): function

3. **NotificationContext:**
   - notificationsEnabled: boolean
   - permission: 'granted' | 'denied' | 'default'
   - enableNotifications(): function
   - disableNotifications(): function
   - sendAstronomyNotification(title, body): function

**LocalStorage:**
- 'token': JWT token
- 'user': User JSON
- 'theme': Theme preference
- 'autoTheme': Auto theme boolean
- 'notificationsEnabled': Notification preference

---

## Conclusie

Dit functioneel ontwerp document beschrijft een complete webapplicatie voor real-time astronomische tracking. De applicatie biedt gebruikers een moderne, intuïtieve interface om zon- en maandata te bekijken, locaties te beheren, en hun ervaring te personaliseren.

**Kernfunctionaliteiten:**
- Gebruikersbeheer met JWT authenticatie
- Real-time astronomische data via externe API
- GPS en handmatige locatieselectie
- Favorieten beheer
- 3 thema's + auto-mode
- Browser notificaties

**Technische Highlights:**
- React SPA met Vite
- FastAPI backend
- MongoDB database
- Responsive design
- Modern CSS met CSS Modules
- Context API voor state management

De applicatie is ontworpen met focus op gebruiksvriendelijkheid, performance, en schaalbaarheid.

---

**Document Versie:** 1.0  
**Laatst Bijgewerkt:** 30 November 2024  
**Status:** Definitief voor Implementatie
