// Importera React och useState-hooken
import React, { useState } from 'react';
// Importera Firebase-funktioner för att lägga till dokument
import { collection, addDoc } from 'firebase/firestore';
// Importera Firebase-instansen
import { db } from '../firebase';

// Komponent för att lägga till en ny teammedlem
export default function MemberForm({ onUpdate }) {
  // Lokalt state för namn, roll och felmeddelande
  const [name, setName] = useState('');
  const [role, setRole] = useState('ux');
  const [error, setError] = useState('');

  // Hanterar formulärets submit-händelse
  const handleSubmit = async (e) => {
    e.preventDefault(); // Förhindra sidomladdning

    // Validera att namn inte är tomt
    if (!name.trim()) {
      setError('Namn får inte vara tomt.');
      return;
    }

    try {
      // Lägg till medlem i Firestore-kollektionen "members"
      await addDoc(collection(db, 'members'), {
        name,          // Namn på medlemmen
        category: role // Roll (kategori): ux, frontend, backend
      });

      // Töm formuläret och nollställ felmeddelande
      setName('');
      setRole('ux');
      setError('');
      onUpdate(); // Uppdatera listan (ex. föräldrakomponent kan hämta nya medlemmar)
    } catch (err) {
      console.error('Kunde inte lägga till medlem:', err);
      setError('Fel vid lagring. Försök igen.');
    }
  };

  return (
    // Formulär med kant, padding och skugga
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Lägg till teammedlem</h2>

      {/* Visar felmeddelande om något är fel */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Inputfält för namn */}
      <input
        type="text"
        className="border w-full p-2 mb-2"
        placeholder="Namn på medlem"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Dropdown för roll/kategori */}
      <select
        className="border w-full p-2 mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="ux">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>

      {/* Submit-knapp */}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Lägg till medlem
      </button>
    </form>
  );
}
