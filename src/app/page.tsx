"use client";

import { useState, useEffect } from "react";

type Task = {
  id: number;
  name: string;
  completed: boolean;
  due: number;
  assignedTo: string;
  completedAt: number | null;
  wasOverdueWhenCompleted: boolean;
};

type Incident = {
  id: number;
  residentId: number;
  createdAt: number;
  decisionSummary: {
    category: string;
    neuro: string;
    careConference: string;
    wound: string;
  };
  tasks: Task[];
};

function normalizeTask(task: Partial<Task>): Task {
  return {
    id: task.id ?? 0,
    name: task.name ?? "",
    completed: task.completed ?? false,
    due: task.due ?? Date.now(),
    assignedTo: task.assignedTo ?? "",
    completedAt: task.completedAt ?? null,
    wasOverdueWhenCompleted: task.wasOverdueWhenCompleted ?? false,
  };
}

function createSeedIncidents(): Incident[] {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  const incidents = [
    {
      id: 1001,
      residentId: 1,
      createdAt: now - 2 * hour,
      decisionSummary: {
        category: "Category 1",
        neuro: "Neuro obs required",
        careConference: "Care conference not required",
        wound: "Wound assessment not required",
      },
      tasks: [
        { id: 1, name: "Action: Falls risk assessment tool completed.", completed: true, due: now + 22 * hour, assignedTo: "Sarah RN", completedAt: now - hour },
        { id: 2, name: "Action: Notify doctor", completed: false, due: now + 22 * hour, assignedTo: "Michael EN" },
        { id: 3, name: "Action: Pain chart for 3 days", completed: false, due: now + 70 * hour, assignedTo: "James AIN" },
        { id: 4, name: "Action: Complete Delirium Screen Tool (4AT)", completed: false, due: now + 46 * hour, assignedTo: "Sarah RN" },
        { id: 5, name: "Action: Write down a progress note per shift for 3 days", completed: true, due: now + 70 * hour, assignedTo: "James AIN", completedAt: now - 30 * 60 * 1000 },
        { id: 6, name: "Action: Notification to family", completed: false, due: now - 2 * hour, assignedTo: "Priya RN" },
        { id: 7, name: "Action: Notification to Aged Care Quality and Safety Commission", completed: false, due: now + 22 * hour, assignedTo: "Linda Care Manager" },
        { id: 8, name: "Action: Neuro observations for 72 hours", completed: false, due: now + 70 * hour, assignedTo: "Michael EN" },
      ],
    },
    {
      id: 1002,
      residentId: 2,
      createdAt: now - 18 * hour,
      decisionSummary: {
        category: "Category 2",
        neuro: "No neuro obs required",
        careConference: "Care conference not required",
        wound: "Wound assessment required",
      },
      tasks: [
        { id: 1, name: "Action: Falls risk assessment tool completed.", completed: true, due: now + 6 * hour, assignedTo: "Linda Care Manager", completedAt: now - 12 * hour },
        { id: 2, name: "Action: Notify doctor", completed: true, due: now + 6 * hour, assignedTo: "Michael EN", completedAt: now - 11 * hour },
        { id: 3, name: "Action: Pain chart for 3 days", completed: false, due: now + 54 * hour, assignedTo: "James AIN" },
        { id: 4, name: "Action: Complete Delirium Screen Tool (4AT)", completed: false, due: now + 30 * hour, assignedTo: "Sarah RN" },
        { id: 5, name: "Action: Write down a progress note per shift for 3 days", completed: false, due: now + 54 * hour, assignedTo: "James AIN" },
        { id: 6, name: "Action: Notification to family", completed: true, due: now - 18 * hour, assignedTo: "Priya RN", completedAt: now - 17 * hour },
        { id: 7, name: "Action: Notification to Aged Care Quality and Safety Commission", completed: false, due: now + 29 * day, assignedTo: "Linda Care Manager" },
        { id: 8, name: "Action: Complete wound assessment", completed: false, due: now + 30 * hour, assignedTo: "Priya RN" },
      ],
    },
    {
      id: 1003,
      residentId: 3,
      createdAt: now - 34 * hour,
      decisionSummary: {
        category: "Category 3",
        neuro: "No neuro obs required",
        careConference: "Care conference required",
        wound: "Wound assessment not required",
      },
      tasks: [
        { id: 1, name: "Action: Falls risk assessment tool completed.", completed: false, due: now - 10 * hour, assignedTo: "Sarah RN" },
        { id: 2, name: "Action: Notify doctor", completed: true, due: now - 10 * hour, assignedTo: "Michael EN", completedAt: now - 9 * hour },
        { id: 3, name: "Action: Pain chart for 3 days", completed: false, due: now + 38 * hour, assignedTo: "James AIN" },
        { id: 4, name: "Action: Complete Delirium Screen Tool (4AT)", completed: false, due: now + 14 * hour, assignedTo: "Sarah RN" },
        { id: 5, name: "Action: Write down a progress note per shift for 3 days", completed: false, due: now + 38 * hour, assignedTo: "James AIN" },
        { id: 6, name: "Action: Notification to family", completed: false, due: now - 26 * hour, assignedTo: "Priya RN" },
        { id: 7, name: "Action: Conduct Care Conference", completed: false, due: now + 38 * hour, assignedTo: "Linda Care Manager" },
      ],
    },
    {
      id: 1004,
      residentId: 1,
      createdAt: now - 2 * day,
      decisionSummary: {
        category: "Category 4",
        neuro: "Neuro obs required",
        careConference: "Care conference not required",
        wound: "Wound assessment required",
      },
      tasks: [
        { id: 1, name: "Action: Falls risk assessment tool completed.", completed: true, due: now - 24 * hour, assignedTo: "Linda Care Manager", completedAt: now - 23 * hour },
        { id: 2, name: "Action: Notify doctor", completed: false, due: now - 24 * hour, assignedTo: "Michael EN" },
        { id: 3, name: "Action: Pain chart for 3 days", completed: false, due: now + 24 * hour, assignedTo: "James AIN" },
        { id: 4, name: "Action: Complete Delirium Screen Tool (4AT)", completed: true, due: now, assignedTo: "Sarah RN", completedAt: now - 2 * hour },
        { id: 5, name: "Action: Write down a progress note per shift for 3 days", completed: false, due: now + 24 * hour, assignedTo: "James AIN" },
        { id: 6, name: "Action: Notification to family", completed: true, due: now - 40 * hour, assignedTo: "Priya RN", completedAt: now - 39 * hour },
        { id: 7, name: "Action: Complete wound assessment", completed: false, due: now, assignedTo: "" },
        { id: 8, name: "Action: Neuro observations for 72 hours", completed: false, due: now + 24 * hour, assignedTo: "Michael EN" },
      ],
    },
    {
      id: 1005,
      residentId: 2,
      createdAt: now - 3 * day,
      decisionSummary: {
        category: "Category 1",
        neuro: "No neuro obs required",
        careConference: "Care conference required",
        wound: "Wound assessment not required",
      },
      tasks: [
        { id: 1, name: "Action: Falls risk assessment tool completed.", completed: true, due: now - 48 * hour, assignedTo: "Linda Care Manager", completedAt: now - 47 * hour },
        { id: 2, name: "Action: Notify doctor", completed: true, due: now - 48 * hour, assignedTo: "Michael EN", completedAt: now - 46 * hour },
        { id: 3, name: "Action: Pain chart for 3 days", completed: false, due: now, assignedTo: "James AIN" },
        { id: 4, name: "Action: Complete Delirium Screen Tool (4AT)", completed: true, due: now - 24 * hour, assignedTo: "Sarah RN", completedAt: now - 23 * hour },
        { id: 5, name: "Action: Write down a progress note per shift for 3 days", completed: false, due: now, assignedTo: "James AIN" },
        { id: 6, name: "Action: Notification to family", completed: true, due: now - 72 * hour, assignedTo: "Priya RN", completedAt: now - 71 * hour },
        { id: 7, name: "Action: Notification to Aged Care Quality and Safety Commission", completed: false, due: now - 48 * hour, assignedTo: "Linda Care Manager" },
        { id: 8, name: "Action: Conduct Care Conference", completed: false, due: now, assignedTo: "" },
      ],
    },
  ];

  return incidents.map((incident): Incident => ({
    ...incident,
    tasks: incident.tasks.map((task) => normalizeTask(task)),
  }));
}

function getInitialIncidents(): Incident[] {
  if (typeof window === "undefined") {
    return createSeedIncidents();
  }

  const savedIncidents = window.localStorage.getItem("nursingHomeIncidents");

  if (!savedIncidents) {
    return createSeedIncidents();
  }

  try {
    const parsedIncidents = JSON.parse(savedIncidents) as (Partial<Omit<Incident, "tasks">> & {
      tasks?: Partial<Task>[];
    })[];

    if (!Array.isArray(parsedIncidents)) {
      return createSeedIncidents();
    }

    return parsedIncidents.map((incident, index): Incident => ({
      id: incident.id ?? Date.now() + index,
      residentId: incident.residentId ?? 1,
      createdAt: incident.createdAt ?? Date.now(),
      decisionSummary: incident.decisionSummary ?? {
        category: "",
        neuro: "",
        careConference: "",
        wound: "",
      },
      tasks: Array.isArray(incident.tasks)
        ? incident.tasks.map((task) => normalizeTask(task))
        : [],
    }));
  } catch {
    return createSeedIncidents();
  }
}

export default function Home() {
  const residents = [
    { id: 1, name: "John Smith", room: "101" },
    { id: 2, name: "Mary Lee", room: "102" },
    { id: 3, name: "Timothy D", room: "203" },
    { id: 4, name: "Helen Brown", room: "104" },
    { id: 5, name: "Robert Chen", room: "205" },
    { id: 6, name: "Amina Patel", room: "206" },
  ];
  const staff = ["Sarah RN", "Michael EN", "Priya RN", "James AIN", "Linda Care Manager"];

  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>(getInitialIncidents);
  const [activeIncidentId, setActiveIncidentId] = useState<number | null>(1001);
  const [now, setNow] = useState(() => Date.now());
  const [answers, setAnswers] = useState({
    category: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const activeIncident = incidents.find((incident) => incident.id === activeIncidentId) ?? incidents[0];
  const buttonStyle = {
    padding: "8px 10px",
    margin: "4px",
    backgroundColor: "#bfdbfe",
    color: "#111827",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  } as const;
  const greyButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#e5e7eb",
  } as const;
  const panelStyle = {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  } as const;
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    backgroundColor: "white",
    width: "100%",
  } as const;
  const selectStyle = {
    padding: 8,
    margin: 4,
  } as const;
  const residentSelectStyle = {
    ...selectStyle,
    backgroundColor: "#d1d5db",
    border: "1px solid #6b7280",
    borderRadius: 4,
  } as const;
  const questionStyle = {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 12,
    marginBottom: 14,
  } as const;
  const sortedIncidents = [...incidents].sort((a, b) => {
    const aIsClosed = a.tasks.length > 0 && a.tasks.every((task) => task.completed);
    const bIsClosed = b.tasks.length > 0 && b.tasks.every((task) => task.completed);
    const aHasOverdueTasks = a.tasks.some((task) => !task.completed && task.due <= now);
    const bHasOverdueTasks = b.tasks.some((task) => !task.completed && task.due <= now);

    if (aIsClosed !== bIsClosed) {
      return aIsClosed ? 1 : -1;
    }

    if (aHasOverdueTasks === bHasOverdueTasks) {
      return b.createdAt - a.createdAt;
    }

    return aHasOverdueTasks ? -1 : 1;
  });
  const openIncidentCount = incidents.filter(
    (incident) => incident.tasks.length === 0 || incident.tasks.some((task) => !task.completed)
  ).length;
  const attentionIncidentCount = incidents.filter((incident) =>
    incident.tasks.some((task) => !task.completed && task.due <= now)
  ).length;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nursingHomeIncidents", JSON.stringify(incidents));
  }, [incidents]);

  function formatTimeRemaining(ms: number) {
    const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }

  function formatIncidentDate(timestamp: number) {
    return new Date(timestamp).toLocaleString();
  }

  function formatClosedDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  function formatCompletedDateTime(timestamp: number) {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getResidentName(residentId: number) {
    const resident = residents.find((resident) => resident.id === residentId);
    return resident ? `${resident.name} - Room ${resident.room}` : "Unknown resident";
  }

  function resetAnswers() {
    setAnswers({
      category: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
    });
  }

  function answerQuestion(question: string, answer: string) {
    setAnswers({
      ...answers,
      [question]: answer,
    });
  }

  function startFallWorkflow() {
    if (selectedResidentId === "") {
      return;
    }

    const createdAt = Date.now();
    const newIncident: Incident = {
      id: createdAt,
      residentId: Number(selectedResidentId),
      createdAt,
      decisionSummary: {
        category: "",
        neuro: "",
        careConference: "",
        wound: "",
      },
      tasks: [],
    };

    setIncidents([...incidents, newIncident]);
    setActiveIncidentId(newIncident.id);
    resetAnswers();
    setNow(createdAt);
    setShowQuestions(true);
  }

  function updateIncidentTasks(
    incidentId: number,
    updateTasks: (tasks: Task[]) => Task[]
  ) {
    setIncidents(
      incidents.map((incident) =>
        incident.id === incidentId ? { ...incident, tasks: updateTasks(incident.tasks) } : incident
      )
    );
  }

  function toggleTask(incidentId: number, taskId: number, completedAt: number) {
    updateIncidentTasks(incidentId, (tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? task.completed
            ? { ...task, completed: false, completedAt: null, wasOverdueWhenCompleted: false }
            : {
                ...task,
                completed: true,
                completedAt,
                wasOverdueWhenCompleted: completedAt > task.due,
              }
          : task
      )
    );
  }

  function assignStaff(incidentId: number, taskId: number, staffName: string) {
    updateIncidentTasks(incidentId, (tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, assignedTo: staffName } : task))
    );
  }

  function generateTasks() {
    if (activeIncidentId === null) {
      return;
    }

    const now = Date.now();
    const decisionSummary = {
      category: answers.category,
      neuro: answers.q2 === "yes" ? "Neuro obs required" : "No neuro obs required",
      careConference:
        answers.q4 === "yes" ? "Care conference required" : "Care conference not required",
      wound: answers.q5 === "yes" ? "Wound assessment required" : "Wound assessment not required",
    };

    const newTasks: Task[] = [
      normalizeTask({ id: 1, name: "Action: Falls risk assessment tool completed.", completed: false, due: now + 24 * 60 * 60 * 1000 }),
      normalizeTask({ id: 2, name: "Action: Notify doctor", completed: false, due: now + 24 * 60 * 60 * 1000 }),
      normalizeTask({ id: 3, name: "Action: Pain chart for 3 days", completed: false, due: now + 72 * 60 * 60 * 1000 }),
      normalizeTask({ id: 4, name: "Action: Complete Delirium Screen Tool (4AT)", completed: false, due: now + 48 * 60 * 60 * 1000 }),
      normalizeTask({ id: 5, name: "Action: Write down a progress note per shift for 3 days", completed: false, due: now + 72 * 60 * 60 * 1000 }),
      normalizeTask({
        id: 6,
        name: "Action: Notification to family",
        completed: false,
        due:
          answers.category === "Category 1" || answers.category === "Category 2"
            ? now
            : now + 8 * 60 * 60 * 1000,
      }),
    ];

    let nextId = 7;

    if (answers.category === "Category 1") {
      newTasks.push(normalizeTask({
        id: nextId,
        name: "Action: Notification to Aged Care Quality and Safety Commission",
        completed: false,
        due: now + 24 * 60 * 60 * 1000,
      }));
      nextId++;
    }

    if (answers.category === "Category 2") {
      newTasks.push(normalizeTask({
        id: nextId,
        name: "Action: Notification to Aged Care Quality and Safety Commission",
        completed: false,
        due: now + 30 * 24 * 60 * 60 * 1000,
      }));
      nextId++;
    }

    if (answers.q2 === "yes") {
      newTasks.push(normalizeTask({
        id: nextId,
        name: "Action: Neuro observations for 72 hours",
        completed: false,
        due: now + 72 * 60 * 60 * 1000,
      }));
      nextId++;
    }

    if (answers.q4 === "yes") {
      newTasks.push(normalizeTask({
        id: nextId,
        name: "Action: Conduct Care Conference",
        completed: false,
        due: now + 72 * 60 * 60 * 1000,
      }));
      nextId++;
    }

    if (answers.q5 === "yes") {
      newTasks.push(normalizeTask({
        id: nextId,
        name: "Action: Complete wound assessment",
        completed: false,
        due: now + 48 * 60 * 60 * 1000,
      }));
    }

    setIncidents(
      incidents.map((incident) =>
        incident.id === activeIncidentId
          ? { ...incident, decisionSummary, tasks: newTasks }
          : incident
      )
    );
    setNow(now);
    setShowQuestions(false);
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb" }}>
      <h1 style={{ marginBottom: 24 }}>Nursing Home Incident MVP</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "start",
        }}
      >
        <section
          style={{
            ...panelStyle,
            flex: "1 1 420px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #9ca3af",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Start New Fall Workflow</h2>

          {!showQuestions && (
            <div style={{ marginBottom: 16 }}>
              <select
                value={selectedResidentId}
                onChange={(event) => setSelectedResidentId(event.target.value)}
                style={residentSelectStyle}
              >
                <option value="">Select resident</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name} - Room {resident.room}
                  </option>
                ))}
              </select>

              <button
                onClick={startFallWorkflow}
                disabled={selectedResidentId === ""}
                style={{
                  ...buttonStyle,
                  opacity: selectedResidentId === "" ? 0.5 : 1,
                }}
              >
                New Incident
              </button>
            </div>
          )}

          {showQuestions && activeIncident && (
            <div>
              <h2>Decision Questions</h2>
              <p style={{ fontWeight: "bold" }}>{getResidentName(activeIncident.residentId)}</p>

              <div style={questionStyle}>
                <p>1) Select incident category</p>
                <button style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 1")}>Category 1</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 2")}>Category 2</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 3")}>Category 3</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 4")}>Category 4</button>
                {answers.category !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.category}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>
                  2) Was there a head strike, suspected head injury, unwitnessed fall or is the resident on anticoagulant or antiplatelet therapy?
                </p>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q2", "yes")}>YES</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q2", "no")}>NO</button>
                {answers.q2 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q2 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>3) Has this been logged in the incident management system?</p>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q3", "yes")}>YES</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q3", "no")}>NO</button>
                {answers.q3 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q3 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>4) Is a care conference required?</p>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q4", "yes")}>YES</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q4", "no")}>NO</button>
                {answers.q4 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q4 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>5) Is a wound assessment required?</p>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q5", "yes")}>YES</button>
                <button style={greyButtonStyle} onClick={() => answerQuestion("q5", "no")}>NO</button>
                {answers.q5 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q5 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <button
                onClick={generateTasks}
                disabled={
                  answers.category === "" ||
                  answers.q2 === "" ||
                  answers.q3 === "" ||
                  answers.q4 === "" ||
                  answers.q5 === ""
                }
                style={{
                  ...buttonStyle,
                  opacity:
                    answers.category === "" ||
                    answers.q2 === "" ||
                    answers.q3 === "" ||
                    answers.q4 === "" ||
                    answers.q5 === ""
                      ? 0.5
                      : 1,
                }}
              >
                Generate Tasks
              </button>
            </div>
          )}
        </section>

        <section style={{ ...panelStyle, flex: "1 1 360px" }}>
          <h2 style={{ marginTop: 0 }}>Incident Dashboard</h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 12,
              fontWeight: "bold",
              flexWrap: "wrap",
            }}
          >
            <div>Total: {incidents.length}</div>
            <div>Open: {openIncidentCount}</div>
            <div style={{ color: attentionIncidentCount > 0 ? "red" : "green" }}>
              Attention: {attentionIncidentCount}
            </div>
          </div>
          {incidents.length === 0 && <p>No incidents yet.</p>}

          <div style={{ height: 320, overflowY: "auto", paddingRight: 4 }}>
            {sortedIncidents.map((incident) => {
              const resident = residents.find((resident) => resident.id === incident.residentId);
              const completedTasks = incident.tasks.filter((task) => task.completed).length;
              const isClosed = incident.tasks.length > 0 && completedTasks === incident.tasks.length;
              const hasOverdueTasks = incident.tasks.some(
                (task) => !task.completed && task.due <= now
              );
              const overdueBeforeCompletionCount = incident.tasks.filter(
                (task) => task.wasOverdueWhenCompleted
              ).length;
              const closedAt = Math.max(
                ...incident.tasks.map((task) => task.completedAt ?? incident.createdAt)
              );

              return (
                <div
                  key={incident.id}
                  style={{
                    ...cardStyle,
                    backgroundColor: isClosed ? "#f3f4f6" : hasOverdueTasks ? "#fff1f2" : "white",
                    opacity: isClosed ? 0.75 : 1,
                    borderColor: hasOverdueTasks
                      ? "#ef4444"
                      : activeIncidentId === incident.id
                      ? "#2563eb"
                      : "#ddd",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.1fr 1.6fr 1.1fr 1.3fr 1.2fr 120px",
                      gap: 12,
                      alignItems: "center",
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {resident?.name ?? "Unknown resident"}
                    </div>
                    <div>{formatIncidentDate(incident.createdAt)}</div>
                    <div>{completedTasks}/{incident.tasks.length} completed</div>
                    <div style={{ fontWeight: "bold" }}>
                      {isClosed ? `Closed ${formatClosedDate(closedAt)}` : "Open"}
                    </div>
                    <div
                      style={{
                        color: isClosed ? "#555" : hasOverdueTasks ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {isClosed
                        ? overdueBeforeCompletionCount > 0
                          ? `${overdueBeforeCompletionCount} tasks were overdue`
                          : "No overdue tasks"
                        : hasOverdueTasks
                        ? "Overdue tasks"
                        : "No overdue tasks"}
                    </div>
                    <button style={buttonStyle} onClick={() => setActiveIncidentId(incident.id)}>
                      View Tasks
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {activeIncident && activeIncident.tasks.length > 0 && (
        <section style={{ ...panelStyle, marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>
            Actions for {getResidentName(activeIncident.residentId)}{" "}
            <span style={{ fontSize: 16, fontWeight: "normal" }}>
              {formatIncidentDate(activeIncident.createdAt)}
            </span>
          </h2>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 10,
              marginBottom: 12,
              backgroundColor: "white",
              fontSize: 14,
            }}
          >
            {activeIncident.decisionSummary.category || "Category not selected"} |{" "}
            {activeIncident.decisionSummary.neuro || "No neuro obs required"} |{" "}
            {activeIncident.decisionSummary.careConference || "Care conference not required"} |{" "}
            {activeIncident.decisionSummary.wound || "Wound assessment not required"}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(260px, 2fr) minmax(180px, 1fr) minmax(220px, 1fr) 140px",
              gap: 12,
              fontWeight: "bold",
              borderBottom: "1px solid #ddd",
              padding: "0 8px 8px 8px",
              marginBottom: 8,
            }}
          >
            <div>Action</div>
            <div>Staff Assigned</div>
            <div>Due Time</div>
            <div>Complete</div>
          </div>

          <div>
            {activeIncident.tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px, 2fr) minmax(180px, 1fr) minmax(220px, 1fr) 140px",
                  gap: 12,
                  alignItems: "center",
                  border: "1px solid #eee",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 8,
                  backgroundColor: task.completed
                    ? "#f3f4f6"
                    : task.due <= now
                    ? "#fff1f2"
                    : "white",
                  lineHeight: 1.5,
                }}
              >
                <div>
                  <div
                    style={{
                      color: !task.completed && task.due <= now ? "red" : "black",
                      fontWeight: !task.completed && task.due <= now ? "bold" : "normal",
                    }}
                  >
                    {task.name}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {task.completed ? "Done" : "Pending"}
                  </div>
                </div>

                <div>
                  <select
                    value={task.assignedTo}
                    style={selectStyle}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) =>
                      assignStaff(activeIncident.id, task.id, event.target.value)
                    }
                  >
                    <option value="">Assign staff</option>
                    {staff.map((staffMember) => (
                      <option key={staffMember} value={staffMember}>
                        {staffMember}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    color: !task.completed && task.due <= now ? "red" : "black",
                    fontWeight: !task.completed && task.due <= now ? "bold" : "normal",
                  }}
                >
                  {task.completed ? (
                    <div>
                      <div>Completed on: {formatCompletedDateTime(task.completedAt ?? now)}</div>
                      {task.wasOverdueWhenCompleted && (
                        <div style={{ color: "black", fontWeight: "bold" }}>(overdue)</div>
                      )}
                    </div>
                  ) : task.due <= now ? (
                    "Due now"
                  ) : (
                    formatTimeRemaining(task.due - now)
                  )}
                </div>

                <button
                  style={task.completed ? greyButtonStyle : buttonStyle}
                  onClick={() => toggleTask(activeIncident.id, task.id, Date.now())}
                >
                  {task.completed ? "Undo" : "Mark complete"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
