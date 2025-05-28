import React from 'react';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Visar alla uppgifter uppdelade i 3 kolumner beroende på status
export default function TaskList({ tasks, members, filters, onUpdate }) {

  // Tilldela en uppgift till en medlem om kategorin matchar
  const assignTask = async (task, memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member || member.category !== task.category)
      return alert("Kan inte tilldela roll med fel kategori");

    const taskRef = doc(db, 'assignments', task.id);
    await updateDoc(taskRef, {
      member: member.name,
      status: 'in-progress'
    });
    onUpdate();
  };

  // Markera uppgift som klar
  const markAsDone = async (taskId) => {
    const taskRef = doc(db, 'assignments', taskId);
    await updateDoc(taskRef, { status: 'finished' });
    onUpdate();
  };

  // Ta bort en uppgift från databasen
  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'assignments', taskId));
    onUpdate();
  };

  // Filtrera och sortera uppgifter enligt valt filter
  const filtered = tasks
    .filter((task) => {
      if (filters.member && task.member !== filters.member) return false;
      if (filters.category && task.category !== filters.category) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'timestamp') {
        return (a.createdAt?.seconds - b.createdAt?.seconds) * dir;
      } else if (filters.sortBy === 'assignment') {
        return a.assignment.localeCompare(b.assignment) * dir;
      }
      return 0;
    });

  // Gruppera uppgifterna i 3 olika sektioner
  const sections = {
    new: [],
    'in-progress': [],
    finished: []
  };

  for (const task of filtered) {
    if (sections[task.status]) {
      sections[task.status].push(task);
    }
  }

  // Format för svensk datum och tid
  const formatDate = (timestamp) =>
    timestamp?.toDate().toLocaleString('sv-SE') ?? '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['new', 'in-progress', 'finished'].map((status) => (
        <div key={status} className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-bold mb-2 capitalize">{status}</h2>

          {/* Visa meddelande om inga uppgifter */}
          {sections[status].length === 0 ? (
            <p className="text-gray-500 italic">Inga uppgifter</p>
          ) : (
            // Visa uppgifter för varje status
            sections[status].map((task) => (
              <div key={task.id} className="border-b pb-2 mb-2">
                <p className="font-semibold">{task.assignment}</p>
                <p className="text-sm text-gray-600">Kategori: {task.category}</p>
                <p className="text-sm text-gray-600">
                  Skapad: {formatDate(task.createdAt)}
                </p>

                {/* Tilldela uppgift om status är "new" */}
                {status === 'new' && (
                  <select
                    className="border p-1 mt-1 w-full"
                    onChange={(e) => assignTask(task, e.target.value)}
                    defaultValue=""
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

                {/* Visa knapp för att markera som klar om status är "in-progress" */}
                {status === 'in-progress' && (
                  <>
                    <p className="text-sm text-gray-600">Tilldelad: {task.member}</p>
                    <button
                      onClick={() => markAsDone(task.id)}
                      className="bg-green-600 text-white px-3 py-1 mt-1 text-sm rounded"
                    >
                      Markera som klar
                    </button>
                  </>
                )}

                {/* Visa knapp för att ta bort uppgift om status är "finished" */}
                {status === 'finished' && (
                  <>
                    <p className="text-sm text-gray-600">Klar av: {task.member}</p>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-600 text-white px-3 py-1 mt-1 text-sm rounded"
                    >
                      Radera
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
