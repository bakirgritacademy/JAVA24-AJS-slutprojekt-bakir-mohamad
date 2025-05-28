// Importerar React och useState-hooken för att hantera komponentens lokala state
import React, { useState } from 'react';
// Importerar funktioner från Firebase för att skapa dokument
import { collection, addDoc, Timestamp } from 'firebase/firestore';
// Importerar Firebase-konfigurationen
import { db } from '../firebase';

// Komponent för att lägga till en ny uppgift direkt i en kolumn
export default function InlineTaskForm({ status, onUpdate }) {
  // State för uppgiftsnamn och kategori
  const [assignment, setAssignment] = useState('');
  const [category, setCategory] = useState('');

  // Funktion som körs när formuläret skickas in
  const handleSubmit = async (e) => {
    e.preventDefault(); // Hindrar sida från att laddas om
    if (!assignment || !category) return; // Avbryt om något fält är tomt

    // Skapa ett nytt dokument i Firestore under "assignments"
    await addDoc(collection(db, 'assignments'), {
      assignment,       // Namnet på uppgiften
      category,         // Vald kategori
      status,           // Status skickas som prop (t.ex. "new")
      createdAt: Timestamp.now(), // Tidsstämpel när uppgiften skapades
      member: ''        // Ingen medlem tilldelad initialt
    });

    // Töm fälten efter skapad uppgift
    setAssignment('');
    setCategory('');
    onUpdate(); // Anropa funktionen för att uppdatera vyn (hämtar nya uppgifter)
  };

  return (
    // Formulär för att skapa en ny uppgift
    <form onSubmit={handleSubmit} className="inline-task-form">
      <div className="mb-2">
        {/* Fält för att skriva in uppgiftsnamn */}
        <input
          type="text"
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
          placeholder="Uppgiftsnamn"
          className="form-control"
        />
      </div>

      <div className="mb-2">
        {/* Dropdown för att välja kategori */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="">Välj kategori</option>
          <option value="ux">UX</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>
      </div>

      <div className="text-end">
        {/* Knapp för att skicka formuläret */}
        <button type="submit" className="btn btn-success btn-sm">
          Lägg till
        </button>
      </div>
    </form>
  );
}
