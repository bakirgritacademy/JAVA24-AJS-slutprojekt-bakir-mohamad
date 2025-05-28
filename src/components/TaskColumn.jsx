import React, { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import InlineTaskForm from './InlineTaskForm.jsx';

// Komponent som representerar en kolumn i taskboarden
export default function TaskColumn({ title, status, tasks, members, onUpdate, categories }) {
  const [showForm, setShowForm] = useState(false); // Visar/gömmer formuläret

  return (
    <div className="task-column">
      {/* Titel på kolumnen */}
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>

      {/* Lista med uppgifter */}
      <div className="task-list">
        {tasks.length === 0 ? (
          // Visas om det inte finns några uppgifter
          <p className="text-gray-500 italic text-sm text-center">Inga uppgifter</p>
        ) : (
          // Renderar alla uppgifter
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              members={members}
              onUpdate={onUpdate}
              categories={categories}
            />
          ))
        )}
      </div>

      {/* Formulär för att lägga till ny uppgift – endast i "Att göra"-kolumn */}
      {status === 'new' && (
        <div className="task-form-wrapper border-top pt-3 mt-3">
          {showForm ? (
            <>
              {/* Visar InlineTaskForm när användaren klickat på "+" */}
              <InlineTaskForm
                status={status}
                categories={categories}
                onUpdate={() => {
                  onUpdate();
                  setShowForm(false); // Stäng formuläret efter uppdatering
                }}
              />
              {/* Avbryt-knapp */}
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-red-600 mt-2"
              >
                Avbryt
              </button>
            </>
          ) : (
            // Plus-knapp för att expandera formuläret
            <div className="text-center mt-2">
              <button
                onClick={() => setShowForm(true)}
                title="Lägg till ny uppgift"
                className="icon-button text-success"
              >
                <i className="bi bi-plus-circle-fill"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
