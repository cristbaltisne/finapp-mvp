"use client";

import { useMemo, useState } from "react";

const suggestedGoals = [
  {
    id: 1,
    title: "Ahorrar para un viaje",
    description: "Ordena tus gastos variables para juntar plata todos los meses.",
    target: 600000,
    current: 180000,
    monthlySuggestion: 70000,
  },
  {
    id: 2,
    title: "Crear fondo de emergencia",
    description: "Construye un colchón financiero para imprevistos.",
    target: 900000,
    current: 250000,
    monthlySuggestion: 85000,
  },
  {
    id: 3,
    title: "Reducir gastos hormiga",
    description: "Detecta gastos pequeños que se acumulan durante el mes.",
    target: 250000,
    current: 60000,
    monthlySuggestion: 40000,
  },
];

const expenses = [
  { id: 1, name: "Uber", category: "Transporte", amount: 42500 },
  { id: 2, name: "Starbucks", category: "Cafés", amount: 28600 },
  { id: 3, name: "PedidosYa", category: "Delivery", amount: 94800 },
  { id: 4, name: "Líder", category: "Supermercado", amount: 76300 },
  { id: 5, name: "Spotify", category: "Suscripciones", amount: 4550 },
  { id: 6, name: "Cine", category: "Entretención", amount: 22000 },
  { id: 7, name: "Bencina", category: "Transporte", amount: 35000 },
];

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [step, setStep] = useState("welcome");
  const [selectedGoal, setSelectedGoal] = useState(null);

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

  const selectedProgress = selectedGoal
    ? Math.min(Math.round((selectedGoal.current / selectedGoal.target) * 100), 100)
    : 0;

  return (
    <main className="page">
      <div className="phone">
        <header className="topbar">
          <div>
            <p className="eyebrow">FinApp</p>
            <h1>Finanzas simples</h1>
          </div>
          <span className="pill">MVP</span>
        </header>

        {step === "welcome" && (
          <section className="center">
            <div className="card hero">
              <div className="icon">$</div>
              <h2>Entiende en qué se te va la plata.</h2>
              <p>
                FinApp ordena tus gastos, detecta patrones y te ayuda a avanzar
                hacia metas financieras concretas.
              </p>
              <button className="primary" onClick={() => setStep("goals")}>
                Empezar
              </button>
              <small>MVP con datos simulados. No conecta cuentas reales.</small>
            </div>
          </section>
        )}

        {step === "goals" && (
          <section>
            <div className="section-title">
              <p className="eyebrow">Metas sugeridas por IA</p>
              <h2>Elige una meta para comenzar</h2>
              <p>
                FinApp te sugiere objetivos simples para ordenar tu plata desde
                el primer mes.
              </p>
            </div>

            <div className="goal-list">
              {suggestedGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={
                    selectedGoal?.id === goal.id ? "goal selected" : "goal"
                  }
                >
                  <div className="goal-head">
                    <h3>{goal.title}</h3>
                    <span>{formatCLP(goal.target)}</span>
                  </div>
                  <p>{goal.description}</p>
                </button>
              ))}
            </div>

            <button
              className="primary"
              disabled={!selectedGoal}
              onClick={() => setStep("dashboard")}
            >
              Ver mi dashboard
            </button>
          </section>
        )}

        {step === "dashboard" && selectedGoal && (
          <section className="dashboard">
            <div className="dark-card">
              <p>Gasto mensual</p>
              <h2>{formatCLP(totalExpenses)}</h2>
              <span>
                Tus mayores gastos este mes están en delivery, supermercado y
                transporte.
              </span>
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Categorías mensuales</h3>
                <span>Junio</span>
              </div>

              <div className="categories">
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

            <div className="card">
              <p className="eyebrow">Insight personalizado</p>
              <h3>Podrías ahorrar {formatCLP(45000)} este mes.</h3>
              <p>
                Si reduces tus gastos en delivery en un 30%, podrías avanzar más
                rápido hacia tu meta de “{selectedGoal.title}”.
              </p>
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <p className="eyebrow">Seguimiento de meta</p>
                  <h3>{selectedGoal.title}</h3>
                </div>
                <span className="progress-pill">{selectedProgress}%</span>
              </div>

              <div className="big-bar">
                <div
                  className="big-bar-fill"
                  style={{ width: `${selectedProgress}%` }}
                />
              </div>

              <div className="money-row">
                <span>{formatCLP(selectedGoal.current)}</span>
                <span>{formatCLP(selectedGoal.target)}</span>
              </div>

              <p>
                Recomendación: ahorra {formatCLP(selectedGoal.monthlySuggestion)}{" "}
                al mes para acercarte a tu objetivo.
              </p>
            </div>

            <button className="secondary" onClick={() => setStep("goals")}>
              Cambiar meta
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
