import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Formulärkomponent för att skapa en ny uppgift
export default function TaskForm({ onUpdate }) {
  const [assignment, setAssignment] = useState(''); // Namn på uppgiften
  const [category, setCategory] = useState('ux');    // Vald kategori
  const [error, setError] = useState('');            // Felmeddelande

  // Hanterar formulärets submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kontrollera att uppgiften inte är tom
    if (!assignment.trim()) {
      setError('Uppgiften får inte vara tom.');
      return;
    }

    try {
      // Spara uppgiften i Firestore
      await addDoc(collection(db, 'assignments'), {
        assignment,
        category,
        status: 'new',           // Alla nya uppgifter får status "new"
        member: '',              // Ingen medlem tilldelad från början
        createdAt: Timestamp.now() // Nuvarande tidpunkt
      });

      // Rensa formulär och eventuella fel
      setAssignment('');
      setCategory('ux');
      setError('');
      onUpdate(); // Uppdatera uppgiftslistan
    } catch (err) {
      console.error('Fel vid skapande av uppgift:', err);
      setError('Något gick fel. Försök igen.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Lägg till ny uppgift</h2>

      {/* Felmeddelande */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Inmatning av uppgiftstitel */}
      <input
        type="text"
        className="border w-full p-2 mb-2"
        placeholder="Titel på uppgift"
        value={assignment}
        onChange={(e) => setAssignment(e.target.value)}
      />

      {/* Välj kategori */}
      <select
        className="border w-full p-2 mb-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="ux">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>

      {/* Submit-knapp */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Skapa uppgift
      </button>
    </form>
  );
}
