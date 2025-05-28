import React from 'react';
import FilterSortPanel from './FilterSortPanel.jsx';
import TaskColumn from './TaskColumn.jsx';

// TaskBoard ansvarar för att filtrera, sortera och visa uppgifter i tre kolumner
export default function TaskBoard({ tasks, members, filters, setFilters, onUpdate, categories }) {
  // 1. Filtrera uppgifter baserat på angivna filter
  const filtered = tasks
    .filter((task) => {
      // Filtrera på medlem om ett namn anges (case-insensitive)
      if (filters.member && !task.member?.toLowerCase().includes(filters.member.toLowerCase()))
        return false;
      // Filtrera på kategori
      if (filters.category && task.category !== filters.category) return false;
      return true;
    })
    .sort((a, b) => {
      // 2. Sortera efter angiven sorteringslogik
      const dir = filters.sortDir === 'asc' ? 1 : -1;

      if (filters.sortBy === 'timestamp') {
        // Sortera efter skapad tid (timestamp)
        return (a.createdAt?.seconds - b.createdAt?.seconds) * dir;
      } else if (filters.sortBy === 'assignment') {
        // Sortera efter uppgiftsnamn (bokstavsordning)
        return a.assignment.localeCompare(b.assignment) * dir;
      }

      // Ingen sortering vald
      return 0;
    });

  // 3. Gruppera uppgifter efter status (new, in-progress, finished)
  const grouped = {
    new: [],
    'in-progress': [],
    finished: []
  };

  for (const task of filtered) {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      {/* Översta sektionen – filterpanel */}
      <div className="max-w-5xl mx-auto">
        <FilterSortPanel filters={filters} setFilters={setFilters} />
      </div>

      {/* Kolumnsektionen – tre kolumner med uppgifter per status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kolumn för "Att göra"-uppgifter */}
        <TaskColumn
          title="Att göra"
          status="new"
          tasks={grouped.new}
          members={members}
          categories={categories}
          onUpdate={onUpdate}
        />

        {/* Kolumn för "Pågående"-uppgifter */}
        <TaskColumn
          title="Pågående"
          status="in-progress"
          tasks={grouped['in-progress']}
          members={members}
          onUpdate={onUpdate}
        />

        {/* Kolumn för "Klar"-uppgifter */}
        <TaskColumn
          title="Klar"
          status="finished"
          tasks={grouped.finished}
          members={members}
          onUpdate={onUpdate}
        />
      </div>
    </section>
  );
}
