import React, { useState, useMemo } from "react";

/**
 * App.jsx
 * Simple Calendar component (month view) with navigation and date selection.
 * Drop this file into src/App.jsx in a Create React App / Vite React project.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfMonth(year, month) {
  return new Date(year, month, 1);
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function App() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = startOfMonth(year, month).getDay(); // 0..6 (Sun..Sat)
  const totalDays = daysInMonth(year, month);

  // build weeks array (each week is array of 7 entries: null or {date, number})
  const weeks = [];
  let current = 1 - firstDay; // may be negative -> leading blanks
  while (current <= totalDays) {
    const week = [];
    for (let i = 0; i < 7; i++, current++) {
      if (current < 1 || current > totalDays) {
        week.push(null);
      } else {
        week.push(new Date(year, month, current));
      }
    }
    weeks.push(week);
  }

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  }

  const styles = {
    container: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      maxWidth: 360,
      margin: "24px auto",
      padding: 12,
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      background: "#fff",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    navButtons: {
      display: "flex",
      gap: 8,
      alignItems: "center",
    },
    button: {
      padding: "6px 8px",
      borderRadius: 6,
      border: "1px solid #cbd5e1",
      background: "#f8fafc",
      cursor: "pointer",
    },
    monthLabel: { fontWeight: 600, fontSize: 16 },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 6,
      textAlign: "center",
    },
    weekday: { fontSize: 12, color: "#475569", paddingBottom: 6 },
    dayCell: {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      cursor: "pointer",
    },
    dayCellMuted: { color: "#94a3b8" },
    dayCellToday: {
      border: "1px solid #2563eb",
      color: "#2563eb",
      fontWeight: 600,
    },
    dayCellSelected: {
      background: "#2563eb",
      color: "#fff",
      fontWeight: 600,
    },
    footer: { marginTop: 12, fontSize: 13, color: "#334155" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.monthLabel}>
          {MONTH_NAMES[month]} {year}
        </div>
        <div style={styles.navButtons}>
          <button aria-label="Previous month" onClick={prevMonth} style={styles.button}>
            ◀
          </button>
          <button aria-label="Today" onClick={goToday} style={styles.button}>
            Today
          </button>
          <button aria-label="Next month" onClick={nextMonth} style={styles.button}>
            ▶
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} style={styles.weekday}>
            {wd}
          </div>
        ))}

        {weeks.flat().map((d, idx) => {
          if (!d) {
            return <div key={idx} style={{ ...styles.dayCell, ...styles.dayCellMuted }} />;
          }
          const isToday = isSameDay(d, today);
          const isSelected = selected && isSameDay(d, selected);

          const cellStyle = {
            ...styles.dayCell,
            ...(isToday ? styles.dayCellToday : {}),
            ...(isSelected ? styles.dayCellSelected : {}),
          };

          return (
            <div
              key={d.toISOString()}
              style={cellStyle}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(d)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(d);
              }}
              aria-pressed={isSelected}
              title={d.toDateString()}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>
        {selected ? (
          <div>
            Selected: {selected.toDateString()}
          </div>
        ) : (
          <div>Click a date to select it.</div>
        )}
      </div>
    </div>
  );
}