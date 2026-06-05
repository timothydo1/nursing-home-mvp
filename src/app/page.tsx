"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function getInitialHowToExpanded() {
  if (typeof window === "undefined") {
    return true;
  }

  const savedValue = window.localStorage.getItem("howToExpanded");

  if (savedValue === null) {
    return !window.matchMedia("(max-width: 900px)").matches;
  }

  return savedValue === "true";
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
  const [howToExpanded, setHowToExpanded] = useState(getInitialHowToExpanded);
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
  const navyButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2c5bc9",
    color: "white",
  } as const;
  const panelStyle = {
    border: "none",
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)",
  } as const;
  const cardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: 4,
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
    backgroundColor: "#e0e3e8",
    border: "1px solid #9ca3af",
    borderRadius: 4,
  } as const;
  const questionStyle = {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 12,
    marginBottom: 14,
  } as const;
  const dashboardGridColumns = "140px 180px 125px 115px 175px 120px";
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

  useEffect(() => {
    window.localStorage.setItem("howToExpanded", String(howToExpanded));
  }, [howToExpanded]);

  function formatTimeRemaining(ms: number) {
    const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }

  function formatIncidentDate(timestamp: number) {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatIncidentReference(incidentId: number) {
    return `FALL-${incidentId}`;
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

  function resetData() {
    window.localStorage.removeItem("incidents");
    window.localStorage.removeItem("nursingHomeIncidents");

    const seedIncidents = createSeedIncidents();
    setIncidents(seedIncidents);
    setActiveIncidentId(seedIncidents[0]?.id ?? null);
    setSelectedResidentId("");
    setShowQuestions(false);
    resetAnswers();
    setNow(Date.now());
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
    const nextIncidentId =
      incidents.length > 0 ? Math.max(...incidents.map((incident) => incident.id)) + 1 : 1001;
    const newIncident: Incident = {
      id: nextIncidentId,
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
    <main
      className="app-page"
      style={{ padding: 24, fontFamily: "Arial, sans-serif", backgroundColor: "#f7f3ed" }}
    >
      <style>{`
        .app-page {
          min-height: 100vh;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .app-page * {
          box-sizing: border-box;
        }

        .app-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: start;
        }

        .dashboard-scroll {
          height: 320px;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 4px;
        }

        .mobile-resident-select {
          display: none;
        }

        .app-page button,
        .app-page select {
          pointer-events: auto;
          touch-action: manipulation;
          -webkit-tap-highlight-color: rgba(44, 91, 201, 0.18);
        }

        @media (max-width: 900px) {
          .app-page {
            padding: 10px !important;
            line-height: 1.35;
          }

          .page-header {
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 8px !important;
            margin-bottom: 8px !important;
          }

          .page-header h1 {
            font-size: 24px;
            line-height: 1.15;
          }

          .app-layout {
            flex-direction: column !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
          }

          .how-to-card,
          .workflow-card,
          .dashboard-card,
          .actions-card {
            width: 100% !important;
            flex: 1 1 auto !important;
            min-width: 0 !important;
            padding: 8px !important;
            margin-bottom: 8px !important;
            gap: 8px !important;
          }

          .actions-card {
            margin-top: 8px !important;
          }

          .how-to-card [data-slot="card-header"],
          .workflow-card [data-slot="card-header"],
          .dashboard-card [data-slot="card-header"],
          .actions-card [data-slot="card-header"] {
            padding: 0 4px !important;
          }

          .how-to-card [data-slot="card-content"],
          .workflow-card [data-slot="card-content"],
          .dashboard-card [data-slot="card-content"],
          .actions-card [data-slot="card-content"] {
            padding: 0 4px !important;
          }

          .workflow-start-row {
            align-items: stretch !important;
            flex-direction: column !important;
            gap: 6px !important;
          }

          .resident-select-trigger,
          .workflow-start-row button {
            width: 100% !important;
          }

          .desktop-resident-select {
            display: none !important;
          }

          .mobile-resident-select {
            display: block !important;
            width: 100% !important;
            min-height: 38px !important;
          }

          .dashboard-scroll {
            height: auto !important;
            max-height: none !important;
            overflow-x: hidden !important;
          }

          .dashboard-header-grid {
            display: none !important;
          }

          .dashboard-incident-card {
            min-width: 0 !important;
            width: 100% !important;
            padding: 7px !important;
            margin-bottom: 4px !important;
          }

          .dashboard-incident-grid {
            grid-template-columns: minmax(0, 1fr) auto !important;
            grid-template-areas:
              "name time"
              "status overdue"
              "completed action" !important;
            column-gap: 8px !important;
            row-gap: 5px !important;
            font-size: 13px !important;
          }

          .dashboard-name {
            grid-area: name;
          }

          .dashboard-time {
            grid-area: time;
            font-size: 12px;
            text-align: right;
          }

          .dashboard-completed {
            grid-area: completed;
          }

          .dashboard-status {
            grid-area: status;
          }

          .dashboard-overdue {
            grid-area: overdue;
            text-align: right;
          }

          .dashboard-overdue [data-slot="badge"] {
            max-width: 100%;
            white-space: normal;
            text-align: center;
          }

          .dashboard-action {
            grid-area: action;
          }

          .dashboard-incident-grid button {
            width: auto !important;
            min-height: 36px !important;
            margin: 0 !important;
            padding: 6px 10px !important;
          }

          .actions-header-grid {
            display: none !important;
          }

          .task-row {
            grid-template-columns: 1fr !important;
            row-gap: 6px !important;
            padding: 8px !important;
            margin-bottom: 5px !important;
            line-height: 1.35 !important;
          }

          .task-row select,
          .task-row button {
            width: 100% !important;
            min-height: 38px !important;
            margin: 0 !important;
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }

          .decision-summary {
            padding: 7px !important;
            margin-bottom: 7px !important;
            line-height: 1.35 !important;
          }

          .app-page button {
            min-height: 36px;
            margin-top: 2px !important;
            margin-bottom: 2px !important;
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        }
      `}</style>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Grandma & Grandpa Care</h1>
          <p style={{ margin: "4px 0 0 0", color: "#555" }}>
            Fall incident workflow prototype
          </p>
        </div>
        <button type="button" style={greyButtonStyle} onClick={resetData}>
          Reset Data
        </button>
      </div>

      <Card
        className="how-to-card"
        style={{
          ...panelStyle,
        }}
      >
        <CardHeader
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CardTitle>How to use</CardTitle>
          <button
            type="button"
            style={{ ...greyButtonStyle, width: 36, padding: "6px 0" }}
            onClick={() => setHowToExpanded(!howToExpanded)}
          >
            {howToExpanded ? "-" : "+"}
          </button>
        </CardHeader>
        {howToExpanded && (
          <CardContent>
            <ul style={{ marginBottom: 0, marginTop: 0, paddingLeft: 22, lineHeight: 1.6 }}>
              <li>Select a resident and start a new fall incident.</li>
              <li>Answer the questions to generate required conditional actions.</li>
              <li>Assign actions to staff.</li>
              <li>Mark actions as complete.</li>
              <li>Use the dashboard to track open and overdue incidents.</li>
            </ul>
          </CardContent>
        )}
      </Card>

      <div
        className="app-layout"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "start",
        }}
      >
        <Card
          className="workflow-card"
          style={{
            ...panelStyle,
            flex: "1 1 420px",
          }}
        >
          <CardHeader>
            <CardTitle>Start New Fall Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            {!showQuestions && (
            <div
              className="workflow-start-row"
              style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
            >
              <div className="desktop-resident-select">
                <Select
                  value={selectedResidentId}
                  onValueChange={setSelectedResidentId}
                >
                  <SelectTrigger
                    className="resident-select-trigger"
                    style={{ ...residentSelectStyle, minWidth: 230 }}
                  >
                    <SelectValue placeholder="Select resident" />
                  </SelectTrigger>
                  <SelectContent>
                    {residents.map((resident) => (
                      <SelectItem key={resident.id} value={String(resident.id)}>
                        {resident.name} - Room {resident.room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <select
                className="mobile-resident-select"
                value={selectedResidentId}
                style={{ ...residentSelectStyle, minWidth: 0 }}
                onChange={(event) => setSelectedResidentId(event.target.value)}
              >
                <option value="">Select resident</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={String(resident.id)}>
                    {resident.name} - Room {resident.room}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={startFallWorkflow}
                disabled={selectedResidentId === ""}
                style={navyButtonStyle}
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
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 1")}>Category 1</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 2")}>Category 2</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 3")}>Category 3</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("category", "Category 4")}>Category 4</button>
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
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q2", "yes")}>YES</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q2", "no")}>NO</button>
                {answers.q2 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q2 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>3) Has this been logged in the incident management system?</p>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q3", "yes")}>YES</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q3", "no")}>NO</button>
                {answers.q3 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q3 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>4) Is a care conference required?</p>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q4", "yes")}>YES</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q4", "no")}>NO</button>
                {answers.q4 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q4 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <div style={questionStyle}>
                <p>5) Is a wound assessment required?</p>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q5", "yes")}>YES</button>
                <button type="button" style={greyButtonStyle} onClick={() => answerQuestion("q5", "no")}>NO</button>
                {answers.q5 !== "" && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}Selected: {answers.q5 === "yes" ? "YES" : "NO"}
                  </span>
                )}
              </div>

              <button
                type="button"
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
          </CardContent>
        </Card>

        <Card
          className="dashboard-card"
          style={{ ...panelStyle, flex: "2 1 760px", overflow: "hidden" }}
        >
          <CardHeader>
            <CardTitle>Incident Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
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
                Needs attention: {attentionIncidentCount}
              </div>
            </div>
            {incidents.length === 0 && <p>No incidents yet.</p>}

            <div
              className="dashboard-scroll"
              style={{ height: 320, overflowY: "auto", overflowX: "hidden", paddingRight: 4 }}
            >
            <div
              className="dashboard-header-grid"
              style={{
                display: "grid",
                gridTemplateColumns: dashboardGridColumns,
                columnGap: 12,
                padding: "0 8px 6px 8px",
                fontSize: 12,
                fontWeight: "bold",
                color: "#555",
                minWidth: 855,
              }}
            >
              <div>Name</div>
              <div>Time</div>
              <div>Completed</div>
              <div>Status</div>
              <div>Overdue</div>
              <div>Action</div>
            </div>
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
              const isSelected = activeIncidentId === incident.id;
              const incidentBorderColor = hasOverdueTasks
                ? "#ef4444"
                : isSelected
                ? "#2c5bc9"
                : "#ddd";

              return (
                <div
                  className="dashboard-incident-card"
                  key={incident.id}
                  style={{
                    ...cardStyle,
                    boxSizing: "border-box",
                    backgroundColor: isClosed ? "#f3f4f6" : hasOverdueTasks ? "#fff1f2" : "white",
                    opacity: isClosed ? 0.75 : 1,
                    border: `${isSelected ? 3 : 1}px solid ${incidentBorderColor}`,
                    minWidth: 855,
                  }}
                >
                  <div
                    className="dashboard-incident-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: dashboardGridColumns,
                      columnGap: 12,
                      alignItems: "center",
                      fontSize: 14,
                    }}
                  >
                    <div className="dashboard-name" style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: "rgba(0, 0, 0, 0.8)",
                          fontSize: 12,
                          fontWeight: "normal",
                          lineHeight: 1.2,
                          marginBottom: 3,
                        }}
                      >
                        {formatIncidentReference(incident.id)}
                      </div>
                      <div style={{ fontWeight: "bold", lineHeight: 1.2 }}>
                        {resident?.name ?? "Unknown resident"}
                      </div>
                    </div>
                    <div className="dashboard-time" style={{ minWidth: 0 }}>
                      {formatIncidentDate(incident.createdAt)}
                    </div>
                    <div className="dashboard-completed" style={{ minWidth: 0 }}>
                      {completedTasks}/{incident.tasks.length} completed
                    </div>
                    <div className="dashboard-status" style={{ minWidth: 0 }}>
                      <Badge
                        variant={isClosed ? "secondary" : "default"}
                        style={isClosed ? undefined : { backgroundColor: "#dcfce7", color: "#166534" }}
                      >
                        {isClosed ? `Closed ${formatClosedDate(closedAt)}` : "Open"}
                      </Badge>
                    </div>
                    <div className="dashboard-overdue" style={{ minWidth: 0 }}>
                      <Badge
                        variant={hasOverdueTasks ? "destructive" : "secondary"}
                        style={
                          !hasOverdueTasks && !isClosed
                            ? { backgroundColor: "#dcfce7", color: "#166534" }
                            : undefined
                        }
                      >
                        {isClosed
                        ? overdueBeforeCompletionCount > 0
                          ? `${overdueBeforeCompletionCount} tasks were overdue`
                          : "No overdue tasks"
                        : hasOverdueTasks
                        ? "Overdue tasks"
                        : "No overdue tasks"}
                      </Badge>
                    </div>
                    <button
                      className="dashboard-action"
                      type="button"
                      style={{ ...navyButtonStyle, width: 110 }}
                      onClick={() => setActiveIncidentId(incident.id)}
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </CardContent>
        </Card>
      </div>

      {activeIncident && activeIncident.tasks.length > 0 && (
        <Card className="actions-card" style={{ ...panelStyle, marginTop: 24 }}>
          <CardHeader>
            <CardTitle>
              <span
                style={{
                  backgroundColor: "#eef0f2",
                  borderRadius: 4,
                  color: "#6b7280",
                  fontSize: 14,
                  fontWeight: "normal",
                  padding: "2px 6px",
                  marginRight: 8,
                }}
              >
                {formatIncidentReference(activeIncident.id)}
              </span>
              <span style={{ color: "#6b7280", marginRight: 8 }}>·</span>
              {getResidentName(activeIncident.residentId)}
            </CardTitle>
            <div style={{ marginTop: 4, color: "#555" }}>
              Incident date/time: {formatIncidentDate(activeIncident.createdAt)}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="decision-summary"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 4,
                padding: 10,
                marginBottom: 12,
                backgroundColor: "#ffffff",
                fontSize: 14,
              }}
            >
              {activeIncident.decisionSummary.category || "Category not selected"} |{" "}
              {activeIncident.decisionSummary.neuro || "No neuro obs required"} |{" "}
              {activeIncident.decisionSummary.careConference || "Care conference not required"} |{" "}
              {activeIncident.decisionSummary.wound || "Wound assessment not required"}
            </div>
          <div
            className="actions-header-grid"
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
                className="task-row"
                key={task.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px, 2fr) minmax(180px, 1fr) minmax(220px, 1fr) 140px",
                  gap: 12,
                  alignItems: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 4,
                  padding: 10,
                  marginBottom: 8,
                  backgroundColor: task.completed
                    ? "#eef0f2"
                    : task.due <= now
                    ? "#fff1f2"
                    : "white",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ opacity: task.completed ? 0.68 : 1 }}>
                  <div
                    style={{
                      color: !task.completed && task.due <= now ? "red" : "black",
                      fontWeight: !task.completed && task.due <= now ? "bold" : "normal",
                    }}
                  >
                    {task.name}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    <Badge
                      variant={task.completed ? "secondary" : "outline"}
                      style={
                        task.completed
                          ? { backgroundColor: "#e5e7eb", color: "#4b5563" }
                          : { backgroundColor: "#fef3c7", color: "#92400e" }
                      }
                    >
                      {task.completed ? "Done" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div style={{ opacity: task.completed ? 0.68 : 1 }}>
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
                    opacity: task.completed ? 0.68 : 1,
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
                  type="button"
                  style={task.completed ? greyButtonStyle : navyButtonStyle}
                  onClick={() => toggleTask(activeIncident.id, task.id, Date.now())}
                >
                  {task.completed ? "Undo" : "Mark complete"}
                </button>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
