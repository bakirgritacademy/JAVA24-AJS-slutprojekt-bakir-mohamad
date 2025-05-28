// Importera React
import React from 'react';

// FilterSortPanel-komponenten tar emot nuvarande filter och en uppdateringsfunktion
export default function FilterSortPanel({ filters, setFilters }) {
  // Hanterar förändringar i sorterings-dropdown
  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      // Nollställ sorteringen om ingen sortering är vald
      setFilters((f) => ({ ...f, sortBy: '', sortDir: 'asc' }));
    } else {
      // Dela upp värdet i sorteringsfält och riktning (ex. "timestamp-desc")
      const [sortBy, sortDir] = value.split('-');
      setFilters((f) => ({ ...f, sortBy, sortDir }));
    }
  };

  return (
    // Wrapper-div med klassen "filter-panel" för styling
    <div className="filter-panel">
      
      {/* Dropdown för sortering */}
      <select
        value={
          filters.sortBy
            ? `${filters.sortBy}-${filters.sortDir}` // Ex. "assignment-asc"
            : ''
        }
        onChange={handleSortChange}
      >
        <option value="">Ingen sortering</option>
        <option value="assignment-asc">Titel A–Ö</option>
        <option value="assignment-desc">Titel Ö–A</option>
        <option value="timestamp-desc">Skapad: Nyast först</option>
        <option value="timestamp-asc">Skapad: Äldst först</option>
      </select>

      {/* Dropdown för filtrering på kategori */}
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters((f) => ({ ...f, category: e.target.value }))
        }
      >
        <option value="">Alla kategorier</option>
        <option value="ux">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>

      {/* Textfält för att filtrera på medlem */}
      <input
        type="text"
        placeholder="Filtrera på medlem..."
        value={filters.member}
        onChange={(e) =>
          setFilters((f) => ({ ...f, member: e.target.value }))
        }
      />
    </div>
  );
}
