# Scrum Board – Slutprojekt

Detta är ett slutprojekt i kursen "JavaScript med React" för GRIT Academy. Applikationen är en enkel Scrum Board där du kan:

- Skapa, tilldela och flytta uppgifter mellan tre kolumner: "Att göra", "Pågående" och "Klar"
- Lägga till teammedlemmar med specifika roller (UX, Frontend, Backend)
- Filtrera och sortera uppgifter
- Uppgifterna och teammedlemmarna sparas i Firebase

## Tekniker som används

- React (med hooks och komponentstruktur)
- Firebase (Authentication + Firestore)
- CSS (ingen extern CSS-ram, endast egen stil)

## Installation

1. Klona detta repo:
   ```bash
   git clone https://github.com/bakirgritacademy/JAVA24-AJS-slutprojekt-bakir-mohamad.git
   ```

2. Gå in i projektmappen:
   ```bash
   cd JAVA24-AJS-slutprojekt-bakir-mohamad
   ```

3. Installera beroenden:
   ```bash
   npm install
   ```

4. Lägg till din Firebase-konfiguration i `firebase.js`

5. Starta projektet:
   ```bash
   npm run dev
   ```

## Firebase Setup

För att projektet ska fungera korrekt måste du skapa ett Firebase-projekt:

- Gå till [Firebase Console](https://console.firebase.google.com/)
- Skapa ett nytt projekt
- Aktivera **Firestore Database**
- Skapa en web app och kopiera konfigurationsobjektet till `firebase.js`

## Funktioner att testa

- Lägg till en ny uppgift i kolumnen "Att göra"
- Tilldela uppgiften till rätt teammedlem baserat på kategori
- Markera som klar
- Skapa teammedlemmar och se hur de kan tilldelas
- Filtrera på kategori eller medlemmar

---

Projektet är skapat i utbildningssyfte av [Bakir Mohamad] som en del av GRIT Academy:s utbildning.
