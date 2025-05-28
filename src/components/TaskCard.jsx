import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Komponent för att visa ett uppgiftskort
export default function TaskCard({ task, members, onUpdate }) {
  // Funktion för att tilldela uppgiften till en medlem
  const assignTask = async (memberId) => {
    const member = members.find((m) => m.id === memberId);

    // Kontrollera att medlem finns och har rätt kategori
    if (!member || member.category !== task.category) {
      return alert('Fel roll för denna uppgift.');
    }

    // Uppdatera uppgiften i databasen
    await updateDoc(doc(db, 'assignments', task.id), {
      member: member.name,
      status: 'in-progress'
    });

    onUpdate(); // Hämta uppdaterade uppgifter
  };

  // Funktion för att markera uppgiften som klar
  const markAsDone = async () => {
    await updateDoc(doc(db, 'assignments', task.id), {
      status: 'finished'
    });

    onUpdate();
  };

  // Funktion för att ta bort uppgiften
  const deleteTask = async () => {
    await deleteDoc(doc(db, 'assignments', task.id));
    onUpdate();
  };

  // Funktion för att återställa uppgiften till tidigare status
  const restoreTask = async (newStatus) => {
    await updateDoc(doc(db, 'assignments', task.id), {
      status: newStatus
    });
    onUpdate();
  };

  // Funktion för att formatera datum från Firestore timestamp
  const formatDate = (timestamp) =>
    timestamp?.toDate().toLocaleString('sv-SE') ?? '';

  return (
    <div className="task-card">
      {/* Titel och info om uppgiften */}
      <p className="fw-bold mb-1">{task.assignment}</p>
      <p className="text-sm text-gray-600">Kategori: {task.category}</p>
      <p className="text-sm text-gray-600">Skapad: {formatDate(task.createdAt)}</p>

      {/* Om uppgiften är ny – visa tilldelningsmeny */}
      {task.status === 'new' && (
        <select
          onChange={(e) => assignTask(e.target.value)}
          defaultValue=""
          className="form-select mt-2 text-sm"
        >
          <option value="" disabled>
            Tilldela till medlem
          </option>
          {members
            .filter((m) => m.category === task.category)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
        </select>
      )}

      {/* Om uppgiften är pågående – visa tilldelad person och klar-knapp */}
      {task.status === 'in-progress' && (
        <div className="mt-2 d-flex align-items-center justify-content-between">
          <p className="text-sm text-gray-600 mb-0">Tilldelad: {task.member}</p>
          <button
            onClick={markAsDone}
            title="Markera som klar"
            className="icon-button bg-success"
          >
            <i className="bi bi-check-circle-fill text-white"></i>
          </button>
        </div>
      )}

      {/* Om uppgiften är klar – visa knapp för att ta bort eller återställa */}
      {task.status === 'finished' && (
        <div className="mt-2 d-flex flex-wrap gap-2">
          <p className="text-sm text-gray-600 w-100 mb-1">Klar av: {task.member}</p>

          <button
            onClick={deleteTask}
            title="Radera"
            className="icon-button bg-danger"
          >
            <i className="bi bi-trash-fill text-white"></i>
          </button>

          <button
            onClick={() => restoreTask('in-progress')}
            title="Återställ till pågående"
            className="icon-button bg-primary"
          >
            <i className="bi bi-arrow-repeat text-white"></i>
          </button>

          <button
            onClick={() => restoreTask('new')}
            title="Återställ till ny"
            className="icon-button bg-secondary"
          >
            <i className="bi bi-skip-backward-fill text-white"></i>
          </button>
        </div>
      )}
    </div>
  );
}
