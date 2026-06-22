"use client";

import { useMemo, useState } from "react";

const expenses = [
  { id: 1, name: "Uber", category: "Transporte", amount: 42500, date: "03 jun" },
  { id: 2, name: "Starbucks", category: "Cafés", amount: 28600, date: "05 jun" },
  { id: 3, name: "PedidosYa", category: "Delivery", amount: 94800, date: "07 jun" },
  { id: 4, name: "Líder", category: "Supermercado", amount: 76300, date: "09 jun" },
  { id: 5, name: "Spotify", category: "Suscripciones", amount: 4550, date: "10 jun" },
  { id: 6, name: "Cine Hoyts", category: "Entretención", amount: 22000, date: "12 jun" },
  { id: 7, name: "Copec", category: "Transporte", amount: 35000, date: "15 jun" },
  { id: 8, name: "Rappi", category: "Delivery", amount: 38400, date: "17 jun" },
];

const initialGoals = [
  {
    id: 1,
    title: "Ahorrar para un viaje",
    description: "Juntar plata todos los meses para financiar un viaje sin endeudarse.",
    target: 600000,
    current: 180000,
    monthlySuggestion: 70000,
    tag: "Viaje",
  },
  {
    id: 2,
    title: "Reducir gastos hormiga",
    description: "Bajar gastos pequeños y frecuentes que se acumulan durante el mes.",
    target: 250000,
    current: 60000,
    monthlySuggestion: 40000,
    tag: "Control",
  },
];

const aiGoalSuggestions = [
  {
    id: 101,
    title: "Crear fondo de emergencia",
    description: "Construir un colchón financiero para cubrir imprevistos sin usar deuda.",
    target: 900000,
    current: 250000,
    monthlySuggestion: 85000,
    tag: "Seguridad",
  },
  {
    id: 102,
    title: "Bajar delivery en 30%",
    description: "Reducir pedidos de comida y redirigir ese ahorro a una meta personal.",
    target: 180000,
    current: 30000,
    monthlySuggestion: 45000,
    tag: "Ahorro",
  },
  {
    id: 103,
    title: "Ahorrar para estudios",
    description: "Separar un monto mensual para financiar cursos, diplomados o un MBA.",
    target: 1200000,
    current: 200000,
    monthlySuggestion: 100000,
    tag: "Educación",
  },
];

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getProgress(goal) {
  return Math.min(Math.round((goal.current / goal.target) * 100), 100);
}

export default function Home() {
  const [tab, setTab] = useState("home");
  const [goals, setGoals] = useState(initialGoals);
  const [activeGoalId, setActiveGoalId] = useState(initialGoals[0].id);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, []);

  const categories = useMemo(() => {
    const grouped = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalExpenses) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [totalExpenses]);

  const activeGoal = goals.find((goal) => goal.id === activeGoalId) || goals[0];
  const topCategory = categories[0];
  const suggestedSaving = 45000;

  function addGoal(goal) {
    const alreadyExists = goals.some((item) => item.title === goal.title);

    if (!alreadyExists) {
      const newGoal = {
        ...goal,
        id: Date.now(),
      };

      setGoals([...goals, newGoal]);
      setActiveGoalId(newGoal.id);
      setTab("goals");
    } else {
      const existingGoal = goals.find((item) => item.title === goal.title);
      setActiveGoalId(existingGoal.id);
      setTab("goals");
    }
  }

  return (
    <main className="app">
      <div className="shell">
        <header className="header">
          <div>
            <p className="eyebrow">FinApp</p>
            <h1>Tu plata, más clara.</h1>
          </div>

          <div className="status-pill">MVP</div>
        </header>

        <section className="content">
          {tab === "home" && (
            <div className="screen">
              <div className="hero-card">
                <p className="eyebrow light">Inicio</p>
                <h2>Entiende en qué gastas y avanza hacia tus metas.</h2>
                <p>
                  FinApp ordena tus movimientos, categoriza gastos y transforma
                  tus datos en recomendaciones simples.
                </p>

                <button className="dark-button" onClick={() => setTab("ai")}>
                  Ver metas sugeridas por IA
                </button>
              </div>

              <div className="grid-2">
                <div className="mini-card">
                  <p>Gasto mensual</p>
                  <h3>{formatCLP(totalExpenses)}</h3>
                </div>

                <div className="mini-card">
                  <p>Ahorro potencial</p>
                  <h3>{formatCLP(suggestedSaving)}</h3>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <p className="eyebrow">Meta principal</p>
                    <h3>{activeGoal.title}</h3>
                  </div>
                  <span>{getProgress(activeGoal)}%</span>
                </div>

                <div className="big-bar">
                  <div
                    className="big-bar-fill"
                    style={{ width: `${getProgress(activeGoal)}%` }}
                  />
                </div>

                <p>
                  Recomendación: ahorra {formatCLP(activeGoal.monthlySuggestion)}{" "}
                  al mes para acercarte a tu objetivo.
                </p>
              </div>
            </div>
          )}

          {tab === "dashboard" && (
            <div className="screen">
              <div className="dark-card">
                <p>Dashboard de gastos</p>
                <h2>{formatCLP(totalExpenses)}</h2>
                <span>
                  Tu mayor categoría de gasto es {topCategory.category}, con{" "}
                  {formatCLP(topCategory.amount)} este mes.
                </span>
              </div>

              <div className="grid-2">
                <div className="mini-card">
                  <p>Categorías</p>
                  <h3>{categories.length}</h3>
                </div>

                <div className="mini-card">
                  <p>Movimientos</p>
                  <h3>{expenses.length}</h3>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h3>Categorías mensuales</h3>
                  <span>Junio</span>
                </div>

                <div className="list">
                  {categories.map((item) => (
                    <div key={item.category} className="category">
                      <div className="category-row">
                        <strong>{item.category}</strong>
                        <span>{formatCLP(item.amount)}</span>
                      </div>

                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "expenses" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Gastos categorizados</p>
                <h2>Movimientos del mes</h2>
                <p>
                  En una versión final, estos gastos se cargarían automáticamente
                  desde bancos o correos transaccionales.
                </p>
              </div>

              <div className="card">
                <div className="list">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="expense-row">
                      <div>
                        <h3>{expense.name}</h3>
                        <p>
                          {expense.category} · {expense.date}
                        </p>
                      </div>
                      <strong>{formatCLP(expense.amount)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "goals" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Seguimiento de metas</p>
                <h2>Tus objetivos financieros</h2>
                <p>
                  Las metas convierten el control financiero en un hábito
                  concreto y medible.
                </p>
              </div>

              <div className="list">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    className={
                      goal.id === activeGoalId ? "goal-card selected" : "goal-card"
                    }
                    onClick={() => setActiveGoalId(goal.id)}
                  >
                    <div className="card-head">
                      <div>
                        <span className="tag">{goal.tag}</span>
                        <h3>{goal.title}</h3>
                      </div>
                      <strong>{getProgress(goal)}%</strong>
                    </div>

                    <p>{goal.description}</p>

                    <div className="big-bar">
                      <div
                        className="big-bar-fill"
                        style={{ width: `${getProgress(goal)}%` }}
                      />
                    </div>

                    <div className="money-row">
                      <span>{formatCLP(goal.current)}</span>
                      <span>{formatCLP(goal.target)}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button className="dark-button" onClick={() => setTab("ai")}>
                Proponer nueva meta con IA
              </button>
            </div>
          )}

          {tab === "ai" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Metas sugeridas por IA</p>
                <h2>Elige una recomendación</h2>
                <p>
                  Estas metas están simuladas para el MVP, pero representan el
                  tipo de recomendación que entregaría la app usando IA.
                </p>
              </div>

              <div className="ai-card">
                <p className="eyebrow light">Perfil detectado</p>
                <h3>Usuario joven con alto gasto variable</h3>
                <p>
                  Según tus movimientos simulados, FinApp detecta oportunidades
                  de ahorro en delivery, transporte y gastos recurrentes.
                </p>
              </div>

              <div className="list">
                {aiGoalSuggestions.map((goal) => (
                  <div key={goal.id} className="card">
                    <div className="card-head">
                      <div>
                        <span className="tag">{goal.tag}</span>
                        <h3>{goal.title}</h3>
                      </div>
                      <span>{formatCLP(goal.target)}</span>
                    </div>

                    <p>{goal.description}</p>

                    <button className="soft-button" onClick={() => addGoal(goal)}>
                      Fijar esta meta
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "insights" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Insights personalizados</p>
                <h2>Acciones concretas para ahorrar</h2>
                <p>
                  El objetivo no es mostrar más datos, sino traducirlos en
                  decisiones simples.
                </p>
              </div>

              <div className="insight-card">
                <span>01</span>
                <h3>Reduce delivery en 30%</h3>
                <p>
                  Este mes gastaste {formatCLP(133200)} en delivery. Si reduces
                  ese gasto en 30%, podrías ahorrar cerca de {formatCLP(40000)}.
                </p>
              </div>

              <div className="insight-card">
                <span>02</span>
                <h3>Revisa gastos recurrentes</h3>
                <p>
                  Detectamos una suscripción mensual. En la app final, FinApp
                  alertaría cargos recurrentes para decidir si mantenerlos o
                  cancelarlos.
                </p>
              </div>

              <div className="insight-card">
                <span>03</span>
                <h3>Conecta gasto con meta</h3>
                <p>
                  Si mantienes el ahorro sugerido de{" "}
                  {formatCLP(activeGoal.monthlySuggestion)} al mes, avanzarás
                  más rápido hacia “{activeGoal.title}”.
                </p>
              </div>
            </div>
          )}
        </section>

        <nav className="nav">
          <button
            className={tab === "home" ? "active" : ""}
            onClick={() => setTab("home")}
          >
            Inicio
          </button>
          <button
            className={tab === "dashboard" ? "active" : ""}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={tab === "expenses" ? "active" : ""}
            onClick={() => setTab("expenses")}
          >
            Gastos
          </button>
          <button
            className={tab === "goals" ? "active" : ""}
            onClick={() => setTab("goals")}
          >
            Metas
          </button>
          <button
            className={tab === "ai" ? "active" : ""}
            onClick={() => setTab("ai")}
          >
            IA
          </button>
          <button
            className={tab === "insights" ? "active" : ""}
            onClick={() => setTab("insights")}
          >
            Insights
          </button>
        </nav>
      </div>
    </main>
  );
}
