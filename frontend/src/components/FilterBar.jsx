function Pill({ label, active, onClick, activeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? activeColor : '#FFFFFF',
        border: `1px solid ${active ? activeColor : '#E0E0E8'}`,
        color: active ? '#FFFFFF' : '#6B6B80',
        fontFamily: "'Sora', sans-serif",
        fontSize: 13,
        padding: '5px 14px',
        borderRadius: 999,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ filters, setFilters }) {
  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      if (value === 'all') return { ...prev, [key]: [] };
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  const isAll = (key) => filters[key].length === 0;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6B6B80', letterSpacing: '0.08em', width: 80 }}>PRIORITY</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Pill label="All" active={isAll('priority')} onClick={() => toggleFilter('priority', 'all')} activeColor="#0A0A0F" />
          <Pill label="🔴 Must" active={filters.priority.includes('must')} onClick={() => toggleFilter('priority', 'must')} activeColor="#E8341C" />
          <Pill label="🟡 Should" active={filters.priority.includes('should')} onClick={() => toggleFilter('priority', 'should')} activeColor="#D4910A" />
          <Pill label="⚪ Optional" active={filters.priority.includes('optional')} onClick={() => toggleFilter('priority', 'optional')} activeColor="#6B6B80" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6B6B80', letterSpacing: '0.08em', width: 80 }}>DIFFICULTY</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Pill label="All" active={isAll('difficulty')} onClick={() => toggleFilter('difficulty', 'all')} activeColor="#0A0A0F" />
          <Pill label="Easy" active={filters.difficulty.includes('easy')} onClick={() => toggleFilter('difficulty', 'easy')} activeColor="#0D9E6E" />
          <Pill label="Medium" active={filters.difficulty.includes('medium')} onClick={() => toggleFilter('difficulty', 'medium')} activeColor="#D4910A" />
          <Pill label="Hard" active={filters.difficulty.includes('hard')} onClick={() => toggleFilter('difficulty', 'hard')} activeColor="#E8341C" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6B6B80', letterSpacing: '0.08em', width: 80 }}>TYPE</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Pill label="All" active={isAll('type')} onClick={() => toggleFilter('type', 'all')} activeColor="#0A0A0F" />
          <Pill label="MCQ" active={filters.type.includes('MCQ')} onClick={() => toggleFilter('type', 'MCQ')} activeColor="#6C63FF" />
          <Pill label="Coding" active={filters.type.includes('coding')} onClick={() => toggleFilter('type', 'coding')} activeColor="#6C63FF" />
          <Pill label="Theory" active={filters.type.includes('theory')} onClick={() => toggleFilter('type', 'theory')} activeColor="#6C63FF" />
        </div>
      </div>
    </div>
  );
}
