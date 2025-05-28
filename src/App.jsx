import React, { useEffect, useState } from 'react';
import MemberForm from './components/MemberForm.jsx';
import TaskBoard from './components/TaskBoard.jsx';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

export default function App() {
  // State för alla uppgifter i Firebase
  const [tasks, setTasks] = useState([]);

  // State för alla teammedlemmar
  const [members, setMembers] = useState([]);

  // State för filterinställningar (medlem, kategori, sortering)
  const [filters, setFilters] = useState({
    member: '',
    category: '',
    sortBy: '',
    sortDir: 'asc'
  });

  // Hämta alla uppgifter från Firebase 'assignments' collection
  const fetchTasks = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'assignments'));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(list);
    } catch (err) {
      console.error('Fel vid hämtning av uppgifter:', err);
    }
  };

  // Hämta alla medlemmar från Firebase 'members' collection
  const fetchMembers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'members'));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(list);
    } catch (err) {
      console.error('Fel vid hämtning av medlemmar:', err);
    }
  };

  // Körs vid start – hämtar uppgifter och medlemmar
  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  return (
    <main className="flex h-screen">
      {/* Vänsterkolumn – visar formulär för att lägga till medlemmar */}
      <aside className="w-1/5 bg-white p-4 shadow overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Scrum Board</h1>
        <MemberForm onUpdate={fetchMembers} />
      </aside>

      {/* Högerkolumn – uppgiftskolumner (att göra, pågående, klar) */}
      <section className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <TaskBoard
          tasks={tasks}
          members={members}
          filters={filters}
          setFilters={setFilters}
          onUpdate={fetchTasks}
        />
      </section>
    </main>
  );
}
