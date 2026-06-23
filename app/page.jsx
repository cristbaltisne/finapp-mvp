"use client";

import { useMemo, useState } from "react";

const initialExpenses = [];

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
    title: "Fondo de emergencia",
    description: "Crear un colchón financiero para imprevistos del día a día.",
    target: 900000,
    current: 250000,
    monthlySuggestion: 85000,
    tag: "Seguridad",
  },
];

const aiGoalSuggestions = [
  {
    id: 101,
    title: "Bajar delivery en 30%",
    description: "Reducir pedidos de comida y redirigir ese ahorro a una meta personal.",
    target: 180000,
    current: 30000,
    monthlySuggestion: 45000,
    tag: "Ahorro",
  },
  {
    id: 102,
    title: "Ahorrar para estudios",
    description: "Separar un monto mensual para financiar cursos, diplomados o un MBA.",
    target: 1200000,
    current: 200000,
    monthlySuggestion: 100000,
    tag: "Educación",
  },
  {
    id: 103,
    title: "Reducir gastos hormiga",
    description: "Identificar gastos pequeños y frecuentes que se acumulan durante el mes.",
    target: 250000,
    current: 60000,
    monthlySuggestion: 40000,
    tag: "Control",
  },
];

const categoriesList = [
  "Transporte",
  "Delivery",
  "Supermercado",
  "Cafés",
  "Suscripciones",
  "Entretención",
  "Alimentación",
  "Salud",
  "Educación",
  "Sin clasificar",
  "Otros",
];

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date) {
  if (!date) return "Sin fecha";

  const parts = date.split("-");
  if (parts.length !== 3) return date;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function getProgress(goal) {
  return Math.min(Math.round((goal.current / goal.target) * 100), 100);
}

function categorizeExpense(description) {
  const text = description.toLowerCase();

  if (
    text.includes("transferencia") ||
    text.includes("transf") ||
    text.includes("tef") ||
    text.includes("pago a persona")
  ) {
    return "Sin clasificar";
  }

  if (
    text.includes("uber") ||
    text.includes("cabify") ||
    text.includes("copec") ||
    text.includes("bencina") ||
    text.includes("metro") ||
    text.includes("micro")
  ) {
    return "Transporte";
  }

  if (
    text.includes("rappi") ||
    text.includes("pedidosya") ||
    text.includes("delivery") ||
    text.includes("mcdonald") ||
    text.includes("burger") ||
    text.includes("pizza")
  ) {
    return "Delivery";
  }

  if (
    text.includes("lider") ||
    text.includes("líder") ||
    text.includes("jumbo") ||
    text.includes("unimarc") ||
    text.includes("tottus")
  ) {
    return "Supermercado";
  }

  if (
    text.includes("starbucks") ||
    text.includes("cafe") ||
    text.includes("café") ||
    text.includes("juan valdez")
  ) {
    return "Cafés";
  }

  if (
    text.includes("spotify") ||
    text.includes("netflix") ||
    text.includes("youtube") ||
    text.includes("apple") ||
    text.includes("suscripcion") ||
    text.includes("suscripción")
  ) {
    return "Suscripciones";
  }

  if (
    text.includes("cine") ||
    text.includes("bar") ||
    text.includes("concierto") ||
    text.includes("entrada")
  ) {
    return "Entretención";
  }

  if (
    text.includes("farmacia") ||
    text.includes("cruz verde") ||
    text.includes("salcobrand") ||
    text.includes("doctor")
  ) {
    return "Salud";
  }

  return "Otros";
}

export default function Home() {
  const [tab, setTab] = useState("home");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [goals, setGoals] = useState(initialGoals);
  const [activeGoalId, setActiveGoalId] = useState(initialGoals[0].id);

  const [newDate, setNewDate] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [lastAddedCategory, setLastAddedCategory] = useState("");

  const [goalAmounts, setGoalAmounts] = useState({});
  const [goalNotification, setGoalNotification] = useState("");
  const [premiumClicked, setPremiumClicked] = useState(false);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const categories = useMemo(() => {
    const grouped = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenses]);

  const activeGoal = goals.find((goal) => goal.id === activeGoalId) || goals[0];

  const topCategory = categories[0] || {
    category: "Sin gastos registrados",
    amount: 0,
  };

  const deliveryCategory = categories.find((item) => item.category === "Delivery");

  const suggestedSaving = deliveryCategory
    ? Math.round(deliveryCategory.amount * 0.3)
    : 0;

  const predictedCategory = newDescription
    ? categorizeExpense(newDescription)
    : "Esperando descripción";

  function addExpense(event) {
    event.preventDefault();

    if (!newDate || !newAmount || !newDescription) {
      alert("Completa fecha, monto y descripción.");
      return;
    }

    const amountAsNumber = Math.abs(Number(newAmount));

    if (!amountAsNumber || amountAsNumber <= 0) {
      alert("Ingresa un monto válido.");
      return;
    }

    const category = categorizeExpense(newDescription);

    const expense = {
      id: Date.now(),
      name: newDescription,
      category,
      amount: amountAsNumber,
      date: newDate,
    };

    setExpenses([expense, ...expenses]);
    setLastAddedCategory(category);
    setNewDate("");
    setNewAmount("");
    setNewDescription("");
    setTab("dashboard");
  }

  function deleteExpense(expenseId) {
    setExpenses(expenses.filter((expense) => expense.id !== expenseId));
  }

  function updateExpenseCategory(expenseId, newCategory) {
    setExpenses(
      expenses.map((expense) => {
        if (expense.id !== expenseId) return expense;

        return {
          ...expense,
          category: newCategory,
        };
      })
    );
  }

  function addMoneyToGoal(goalId) {
    const amount = Math.abs(Number(goalAmounts[goalId]));

    if (!amount || amount <= 0) {
      alert("Ingresa un monto válido para agregar a la meta.");
      return;
    }

    setGoals(
      goals.map((goal) => {
        if (goal.id !== goalId) return goal;

        return {
          ...goal,
          current: Math.min(goal.current + amount, goal.target),
        };
      })
    );

    setGoalAmounts({
      ...goalAmounts,
      [goalId]: "",
    });

    setActiveGoalId(goalId);
    setGoalNotification(
      "Ahorro agregado. Te recordaremos revisar esta meta durante la semana."
    );
  }

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

          <div className="status-pill">Beta privada</div>
        </header>

        <section className="content">
          {tab === "home" && (
            <div className="screen">
              <div className="hero-card">
                <p className="eyebrow light">Inicio</p>
                <h2>Controla tus gastos sin planillas ni enredos.</h2>
                <p>
                  FinApp ordena tus movimientos, detecta patrones de gasto y te
                  ayuda a avanzar hacia tus metas financieras.
                </p>

                <button className="dark-button" onClick={() => setTab("add")}>
                  Empezar ahora
                </button>
              </div>

              <div className="card">
                <p className="eyebrow">Cómo funciona</p>

                <div className="onboarding-step">
                  <span>1</span>
                  <div>
                    <h3>Ingresa tus movimientos</h3>
                    <p>
                      En esta beta puedes ingresar gastos manualmente para
                      simular la conexión bancaria.
                    </p>
                  </div>
                </div>

                <div className="onboarding-step">
                  <span>2</span>
                  <div>
                    <h3>FinApp los categoriza</h3>
                    <p>
                      La app clasifica comercios reconocibles y deja sin
                      clasificar movimientos ambiguos.
                    </p>
                  </div>
                </div>

                <div className="onboarding-step">
                  <span>3</span>
                  <div>
                    <h3>Recibe metas e insights</h3>
                    <p>
                      Convierte tus gastos en decisiones concretas de ahorro.
                    </p>
                  </div>
                </div>
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
                  Llevas {formatCLP(activeGoal.current)} de{" "}
                  {formatCLP(activeGoal.target)}. Recomendación: ahorra{" "}
                  {formatCLP(activeGoal.monthlySuggestion)} al mes para acercarte
                  a tu objetivo.
                </p>
              </div>

              {lastAddedCategory && (
                <div className="success-card">
                  Último gasto agregado y categorizado como:{" "}
                  <strong>{lastAddedCategory}</strong>
                </div>
              )}
            </div>
          )}

          {tab === "dashboard" && (
            <div className="screen">
              <div className="dark-card">
                <p>Panel de gastos</p>
                <h2>{formatCLP(totalExpenses)}</h2>
                <span>
                  {expenses.length === 0
                    ? "Aún no hay gastos registrados. Agrega un movimiento para ver el análisis."
                    : `Tu mayor categoría de gasto es ${topCategory.category}, con ${formatCLP(
                        topCategory.amount
                      )} este mes.`}
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
                  {categories.length === 0 && (
                    <div className="empty-state">
                      <h3>No hay categorías todavía</h3>
                      <p>
                        Agrega un gasto para que FinApp lo clasifique
                        automáticamente.
                      </p>
                      <button className="soft-button" onClick={() => setTab("add")}>
                        Agregar gasto
                      </button>
                    </div>
                  )}

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

              {expenses.length > 0 && (
                <div className="insight-card">
                  <span>Insight</span>
                  <h3>Reduce tu mayor categoría</h3>
                  <p>
                    Si reduces {topCategory.category} en 15%, podrías ahorrar
                    cerca de {formatCLP(Math.round(topCategory.amount * 0.15))}.
                  </p>
                </div>
              )}

              <button className="dark-button" onClick={() => setTab("add")}>
                Agregar nuevo gasto
              </button>
            </div>
          )}

          {tab === "add" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Agregar movimiento</p>
                <h2>Ingresa un gasto</h2>
                <p>
                  En esta beta, el ingreso manual simula la conexión con tus
                  cuentas bancarias.
                </p>
              </div>

              <form className="form-card" onSubmit={addExpense}>
                <label>
                  Fecha
                  <input
                    type="date"
                    value={newDate}
                    onChange={(event) => setNewDate(event.target.value)}
                  />
                </label>

                <label>
                  Monto
                  <input
                    type="number"
                    placeholder="Ej: 18500"
                    value={newAmount}
                    onChange={(event) => setNewAmount(event.target.value)}
                  />
                </label>

                <label>
                  Descripción
                  <input
                    type="text"
                    placeholder="Ej: Uber, Rappi, Spotify, Transferencia Juan..."
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                  />
                </label>

                <div className="detected-card">
                  <p>Categoría detectada</p>
                  <h3>{predictedCategory}</h3>
                  {predictedCategory === "Sin clasificar" && (
                    <p>
                      Las transferencias entre personas quedan sin clasificar
                      hasta que el usuario agregue más contexto.
                    </p>
                  )}
                </div>

                <button className="dark-button" type="submit">
                  Agregar y actualizar panel
                </button>
              </form>

              <div className="card">
                <p className="eyebrow">Prueba rápida</p>
                <p>
                  Usa “Uber” para Transporte, “Rappi” para Delivery, “Spotify”
                  para Suscripciones o “Transferencia Andrés” para Sin
                  clasificar.
                </p>
              </div>
            </div>
          )}

          {tab === "expenses" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Movimientos</p>
                <h2>Gastos categorizados</h2>
                <p>
                  Puedes corregir categorías manualmente para mejorar la calidad
                  del análisis.
                </p>
              </div>

              <div className="card">
                <div className="list">
                  {expenses.length === 0 && (
                    <div className="empty-state">
                      <h3>No hay gastos registrados</h3>
                      <p>
                        Agrega tu primer movimiento para ver el panel actualizado.
                      </p>
                      <button className="soft-button" onClick={() => setTab("add")}>
                        Agregar gasto
                      </button>
                    </div>
                  )}

                  {expenses.map((expense) => (
                    <div key={expense.id} className="expense-row editable">
                      <div>
                        <h3>{expense.name}</h3>
                        <p>{formatDate(expense.date)}</p>

                        <select
                          className="category-select"
                          value={expense.category}
                          onChange={(event) =>
                            updateExpenseCategory(expense.id, event.target.value)
                          }
                        >
                          {categoriesList.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="expense-actions">
                        <strong>{formatCLP(expense.amount)}</strong>
                        <button
                          className="delete-button"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "goals" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Metas financieras</p>
                <h2>Haz seguimiento a tu ahorro</h2>
                <p>
                  Agrega dinero ahorrado a cada meta y recibe recordatorios
                  simulados de seguimiento.
                </p>
              </div>

              {goalNotification && (
                <div className="success-card">{goalNotification}</div>
              )}

              <div className="list">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={
                      goal.id === activeGoalId
                        ? "goal-card selected"
                        : "goal-card"
                    }
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

                    <div className="goal-contribution">
                      <input
                        type="number"
                        placeholder="Ej: 30000"
                        value={goalAmounts[goal.id] || ""}
                        onChange={(event) =>
                          setGoalAmounts({
                            ...goalAmounts,
                            [goal.id]: event.target.value,
                          })
                        }
                      />

                      <button
                        className="soft-button"
                        onClick={() => addMoneyToGoal(goal.id)}
                      >
                        Agregar ahorro
                      </button>
                    </div>

                    <button
                      className="goal-main-button"
                      onClick={() => setActiveGoalId(goal.id)}
                    >
                      Usar como meta principal
                    </button>
                  </div>
                ))}
              </div>

              <button className="dark-button" onClick={() => setTab("ai")}>
                Ver metas sugeridas
              </button>
            </div>
          )}

          {tab === "ai" && (
            <div className="screen">
              <div className="section-title">
                <p className="eyebrow">Recomendaciones</p>
                <h2>Metas sugeridas por FinApp</h2>
                <p>
                  La app transforma patrones de gasto en objetivos financieros
                  simples y accionables.
                </p>
              </div>

              <div className="ai-card">
                <p className="eyebrow light">Perfil detectado</p>
                <h3>
                  {expenses.length === 0
                    ? "Aún no hay suficientes datos"
                    : "Usuario con gasto variable relevante"}
                </h3>
                <p>
                  {expenses.length === 0
                    ? "Agrega algunos movimientos para que FinApp pueda detectar oportunidades de ahorro."
                    : `Según tus movimientos, FinApp detecta oportunidades de ahorro en ${topCategory.category}, gastos recurrentes y consumo impulsivo.`}
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

          {tab === "premium" && (
            <div className="screen">
              <div className="hero-card">
                <p className="eyebrow light">FinApp Premium</p>
                <h2>$3.990 al mes</h2>
                <p>
                  Para usuarios que quieren automatizar el control financiero y
                  recibir recomendaciones más avanzadas.
                </p>

                <button
                  className="dark-button"
                  onClick={() => setPremiumClicked(true)}
                >
                  Quiero el plan premium
                </button>
              </div>

              {premiumClicked && (
                <div className="success-card">
                  Listo. Te avisaremos cuando el plan premium esté disponible en
                  la beta cerrada.
                </div>
              )}

              <div className="card">
                <p className="eyebrow">Incluye</p>

                <div className="benefit-row">
                  <span>✓</span>
                  <p>Conexión automática con cuentas bancarias compatibles.</p>
                </div>

                <div className="benefit-row">
                  <span>✓</span>
                  <p>Categorización inteligente de movimientos.</p>
                </div>

                <div className="benefit-row">
                  <span>✓</span>
                  <p>Recomendaciones accionables para ahorrar todos los meses.</p>
                </div>

                <div className="benefit-row">
                  <span>✓</span>
                  <p>Recordatorios de seguimiento para tus metas financieras.</p>
                </div>
              </div>

              <div className="card">
                <p className="eyebrow">Prueba inicial</p>
                <h3>30 días gratis</h3>
                <p>
                  Puedes probar FinApp Premium antes de decidir si pagar el plan
                  mensual.
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
            Panel
          </button>
          <button
            className={tab === "add" ? "active" : ""}
            onClick={() => setTab("add")}
          >
            Agregar
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
            className={tab === "premium" ? "active" : ""}
            onClick={() => setTab("premium")}
          >
            Premium
          </button>
        </nav>
      </div>
    </main>
  );
}
