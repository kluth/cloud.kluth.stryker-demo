---
theme: default
title: "Stryker Mutation Testing: Die Masterclass"
colorSchema: auto
info: false
controls: true
drawings: false
download: false
class: text-center
highlighter: shiki
transition: slide-left
mdc: true
styles:
  - ./styles/index.css
---

<div class="glass-card text-center p-5 mt-1 mb-3 accent-cyan">
  <span class="text-xs font-bold uppercase tracking-wider text-sky-400">Masterclass Schulungs-Reihe</span>
  <h1 class="text-2xl font-bold tracking-tight my-1">Stryker Mutation Testing</h1>
  <h3 class="text-sm font-medium opacity-90 mb-3">Qualität jenseits von Code Coverage: Erstellung robuster Enterprise Test-Suites</h3>

  <div class="pt-1 pb-1 flex justify-center gap-3 flex-wrap">
    <MutantBadge status="KILLED" label="Killed Mutants" size="md" />
    <MutantBadge status="COMPILE_ERROR" label="Nx Monorepo" size="md" />
    <MutantBadge status="NO_COVERAGE" label="Angular 22 + NgRx Signals" size="md" />
  </div>
</div>

<div class="glass-card text-center p-3">
  <p class="text-xs italic font-medium m-0">
    "Hohe Code Coverage zeigt, welche Zeilen ausgeführt wurden. Mutation Testing zeigt, ob deine Tests tatsächlich etwas prüfen."
  </p>
</div>

<!--
Presenter Notes:
- Herzlich willkommen zur Stryker Mutation Testing Masterclass!
- Diese Schulung ist in 4 abgeschlossene Kapitel unterteilt, damit wir sie bei Bedarf auch in mehreren Sessions durchgehen können.
- Ziel des Kurses: Nach allen 4 Kapiteln seid ihr absolute Profis im Aufdecken blinder Flecken in Test-Suites.
-->

---
transition: slide-up
layout: default
---

# Agenda & Schulungs-Kapitel

<div class="grid grid-cols-2 gap-3 mt-3">
  <div class="glass-card accent-cyan">
    <div class="flex items-center gap-2 mb-1">
      <span class="font-bold text-sky-400 text-sm">Kapitel 1</span>
    </div>
    <h4 class="font-bold text-xs m-0">Prinzipien & Mutation Testing Grundlagen</h4>
    <p class="text-xs mt-1 mb-0 opacity-80">
      Warum 100% Coverage eine Illusion ist, wie AST-Mutationen funktionieren & interaktives Quiz.
    </p>
  </div>

  <div class="glass-card accent-violet">
    <div class="flex items-center gap-2 mb-1">
      <span class="font-bold text-purple-400 text-sm">Kapitel 2</span>
    </div>
    <h4 class="font-bold text-xs m-0">Monorepo Architektur & Setup</h4>
    <p class="text-xs mt-1 mb-0 opacity-80">
      Praxis-Setup in Angular 22, NgRx Signals, Vitest & Deep-Dive Konfiguration (`stryker.config.json`).
    </p>
  </div>

  <div class="glass-card accent-emerald">
    <div class="flex items-center gap-2 mb-1">
      <span class="font-bold text-emerald-400 text-sm">Kapitel 3</span>
    </div>
    <h4 class="font-bold text-xs m-0">Performance & CI/CD Pipelines</h4>
    <p class="text-xs mt-1 mb-0 opacity-80">
      Von 15 Minuten auf <30s via Incremental Caching, GitHub Actions & Survivor-Debugging-Strategien.
    </p>
  </div>

  <div class="glass-card accent-rose">
    <div class="flex items-center gap-2 mb-1">
      <span class="font-bold text-rose-400 text-sm">Kapitel 4</span>
    </div>
    <h4 class="font-bold text-xs m-0">Profi Best Practices & Master-Checkliste</h4>
    <p class="text-xs mt-1 mb-0 opacity-80">
      Schwellenwert-Regeln (`thresholds`), Vergleiche, Masterclass-Checkliste & Zertifikat.
    </p>
  </div>
</div>

<!--
Presenter Notes:
- Stellt den Schulungsplan vor. Jedes Kapitel schließt mit einem kurzen Wissenstest (Quiz) ab, um das Erlernte zu festigen.
-->

---
transition: fade-out
layout: cover
---

<div class="glass-card text-center p-8 accent-cyan">
  <span class="text-xs font-bold uppercase tracking-wider text-sky-400">Kapitel 1</span>
  <h1 class="text-3xl font-bold my-2">Fundament & Prinzipien</h1>
  <p class="text-sm font-medium opacity-80 m-0">
    Warum Code Coverage täuscht, wie AST Mutatoren arbeiten & die Evaluation von Mutanten.
  </p>
</div>

<!--
Presenter Notes:
- Kapitel 1 legt das theoretische und praktische Fundament.
- Wir klären, warum klassische Testabdeckung oft ein falsches Sicherheitsgefühl vermittelt.
-->

---
transition: fade-out
layout: two-cols
---

# Die Illusion von Code Coverage

### Warum 100% Coverage eine trügerische Sicherheit bietet

<div class="pr-3">
  <div class="glass-card accent-rose mb-3" v-click>
    <h4 class="text-rose-300 font-semibold mb-1 text-xs">Die naive Annahme</h4>
    <p class="text-xs font-medium m-0">
      "Jede Zeile lief in <code>npm test</code>, also ist unsere Software garantiert fehlerfrei."
    </p>
  </div>

  <div class="glass-card accent-amber" v-click>
    <h4 class="text-amber-300 font-semibold mb-1 text-xs">Die Realität</h4>
    <p class="text-xs font-medium m-0">
      Coverage-Tools (V8, Istanbul) messen lediglich die Code-Ausführung—nicht aber, ob die Tests das Ergebnis tatsächlich <strong>verifizieren</strong>.
    </p>
  </div>
</div>

::right::

<div class="pl-3">

```ts {all|3|all}
// loyalty.store.ts — Geschäftslogik
export function isEligibleForDiscount(pts: number): boolean {
  return pts >= 1000;
}
```

```ts {all|3|all}
// loyalty.store.spec.ts — 100% Coverage, 0 Assertions
it('should execute discount logic', () => {
  isEligibleForDiscount(1500); // ❌ Keine expect() Assertion!
});
```

<div class="mt-2 text-xs text-rose-300 font-bold" v-click>
  V8 Report: 100% Coverage PASS (Geprüfter Wert: Keiner)
</div>

</div>

<!--
Presenter Notes:
- Schaut auf den rechten Code-Block.
- Zeile 3 des Tests: `isEligibleForDiscount(1500)` führt den Pfad aus und bringt 100% Coverage, prüft aber rein gar nichts.
- Wenn ein Entwickler `>= 1000` zu `< 1000` ändert, bleibt der Test grün! Mutation Testing deckt genau das sofort auf.
-->

---
transition: slide-up
layout: default
---

# Was ist Mutation Testing & Stryker?

### Der Wahrheitssensor für deine Test-Suite

<div class="grid grid-cols-3 gap-3 mt-3">
  <div class="glass-card accent-cyan" v-click>
    <div class="flex items-center gap-2 mb-1">
      <h4 class="text-sky-300 font-semibold m-0 text-xs">1. Mutanten injizieren</h4>
    </div>
    <p class="text-xs font-medium m-0">
      Stryker analysiert den AST (Abstract Syntax Tree) und baut gezielt kleine Fehler (Mutanten) in die Quellcode-Dateien ein.
    </p>
  </div>

  <div class="glass-card accent-violet" v-click>
    <div class="flex items-center gap-2 mb-1">
      <h4 class="text-purple-300 font-semibold m-0 text-xs">2. Test-Suite ausführen</h4>
    </div>
    <p class="text-xs font-medium m-0">
      Führt deine Vitest Unit Tests gegen jede mutierte Variante in isolierten Sandbox-Workern aus.
    </p>
  </div>

  <div class="glass-card accent-emerald" v-click>
    <div class="flex items-center gap-2 mb-1">
      <h4 class="text-emerald-300 font-semibold m-0 text-xs">3. Ergebnis auswerten</h4>
    </div>
    <p class="text-xs font-medium m-0">
      Test schlägt fehl &rarr; <strong>Killed</strong> (Erfolg!). Tests bestehen &rarr; <strong>Survived</strong> (Warnung: Test-Suite hat Bug übersehen).
    </p>
  </div>
</div>

<div class="mt-5 flex justify-center gap-4" v-click>
  <div class="metric-badge emerald">
    <span class="metric-value">Killed</span>
    <span class="metric-label">Mutant erkannt</span>
  </div>

  <div class="metric-badge rose">
    <span class="metric-value">Survived</span>
    <span class="metric-label">Fehlende Assertion</span>
  </div>

  <div class="metric-badge violet">
    <span class="metric-value">No Coverage</span>
    <span class="metric-label">Ungetestete Logik</span>
  </div>
</div>

<!--
Presenter Notes:
- Umdenken erforderlich: Beim normalen Testing sind fehlgeschlagene Tests schlecht. Bei Mutation Testing bedeutet ein fehlschlagender Test, dass ein Mutant "Killed" wurde—was ein großer Gewinn ist!
-->

---
transition: fade
layout: two-cols
---

# AST Mutation Operators in der Praxis

### Wie Stryker Code systematisch auf die Probe stellt

<div class="pr-3">
  <p class="text-xs font-medium mb-2">
    Integrierte AST Mutation Operators für TypeScript:
  </p>

  <ul class="text-xs font-medium space-y-1.5 pl-3">
    <li><strong class="text-sky-300">Equality:</strong> <code>===</code> &rarr; <code>!==</code>, <code>&gt;=</code> &rarr; <code>&gt;</code></li>
    <li><strong class="text-sky-300">Arithmetic:</strong> <code>+</code> &rarr; <code>-</code>, <code>*</code> &rarr; <code>/</code></li>
    <li><strong class="text-sky-300">Logical:</strong> <code>&amp;&amp;</code> &rarr; <code>||</code></li>
    <li><strong class="text-sky-300">Boolean Literals:</strong> <code>true</code> &rarr; <code>false</code></li>
    <li><strong class="text-sky-300">Optional Chaining:</strong> <code>user?.cart</code> &rarr; <code>user.cart</code></li>
    <li><strong class="text-sky-300">Block Statements:</strong> <code>{ return val; }</code> &rarr; <code>{}</code></li>
  </ul>
</div>

::right::

<div class="pl-3 space-y-1">

```ts
// Original Quellcode (cart.store.ts)
const hasDiscount = cart.total >= 100 && user.isVIP;
```

```ts
// Mutant #1: LogicalOperator
const hasDiscount = cart.total >= 100 || user.isVIP; // Logik verändert!
```

```ts
// Mutant #2: EqualityOperator
const hasDiscount = cart.total > 100 && user.isVIP; // Grenzwert-Test fehlt!
```

</div>

<!--
Presenter Notes:
- Geht durch Mutant #1: Änderung von `&&` zu `||`.
- Fragt das Publikum: "Prüft eure Test-Suite beide Bedingungen unabhängig voneinander oder nur den Standardfall?"
-->

---
transition: slide-up
layout: default
---

# 🧠 Wissenstest: Kapitel 1

<QuizCard
  chapter="Kapitel 1"
  question="Was bedeutet es in Stryker Mutation Testing, wenn ein Mutant den Status 'SURVIVED' erhält?"
  :options="[
    { key: 'A', text: 'Ein schwerwiegender Syntaxfehler im Quellcode verhinderte die Ausführung.' },
    { key: 'B', text: 'Der injizierte Fehler wurde von den Unit Tests NICHT bemerkt – alle Tests blieben grün.', correct: true, explanation: 'Richtig! Ein Survived Mutant bedeutet, dass dein Quellcode verändert wurde, aber alle Tests bestanden haben. Es fehlt eine scharfe Assertion!' },
    { key: 'C', text: 'Stryker hat den Mutanten erfolgreich vernichtet und der Test ist fehlgeschlagen.' },
    { key: 'D', text: 'Der Quellcode wurde von der Mutation ausgenommen.' }
  ]"
/>

<!--
Presenter Notes:
- Lasst die Teilnehmer kurz überlegen und interaktiv abstimmen!
- Nach dem Klick auf Option B wird die Erklärung eingeblendet.
-->

---
transition: fade-out
layout: cover
---

<div class="glass-card text-center p-8 accent-violet">
  <span class="text-xs font-bold uppercase tracking-wider text-purple-400">Kapitel 2</span>
  <h1 class="text-3xl font-bold my-2">Monorepo Architektur & Setup</h1>
  <p class="text-sm font-medium opacity-80 m-0">
    Praxis-Setup mit Angular 22, NgRx Signals, Vitest, Nx & Deep-Dive Konfiguration.
  </p>
</div>

<!--
Presenter Notes:
- Kapitel 2 widmet sich der konkreten Umsetzung in unserem Monorepo Workspace.
-->

---
transition: slide-left
layout: default
---

# Monorepo Architektur (`cloud.kluth.stryker-demo`)

<div class="grid grid-cols-4 gap-3 mt-3">
  <div class="glass-card accent-cyan">
    <h4 class="text-sky-300 font-semibold m-0 text-xs">Cart Domain</h4>
    <p class="text-xs font-medium mt-1 mb-0 opacity-80">
      SignalStore mit Währungsumrechnung & Gutscheinlogik.
    </p>
    <MutantBadge status="KILLED" label="100% Score" size="sm" class="mt-2" />
  </div>

  <div class="glass-card accent-violet">
    <h4 class="text-purple-300 font-semibold m-0 text-xs">Loyalty Domain</h4>
    <p class="text-xs font-medium mt-1 mb-0 opacity-80">
      Stufenaufstieg (Bronze &rarr; Platinum) & Gutscheine.
    </p>
    <MutantBadge status="KILLED" label="100% Score" size="sm" class="mt-2" />
  </div>

  <div class="glass-card accent-emerald">
    <h4 class="text-emerald-300 font-semibold m-0 text-xs">Wishlist Domain</h4>
    <p class="text-xs font-medium mt-1 mb-0 opacity-80">
      Bestandsbenachrichtigungen & Preissturz-Berechnungen.
    </p>
    <MutantBadge status="KILLED" label="100% Score" size="sm" class="mt-2" />
  </div>

  <div class="glass-card accent-amber">
    <h4 class="text-amber-300 font-semibold m-0 text-xs">Checkout & Search</h4>
    <p class="text-xs font-medium mt-1 mb-0 opacity-80">
      Schritt-für-Schritt Checkout Wizard & Suchfilter-Engine.
    </p>
    <MutantBadge status="KILLED" label="100% Score" size="sm" class="mt-2" />
  </div>
</div>

<div class="glass-card mt-3">
  <h4 class="font-semibold text-xs mb-1">Architektur & Tech Stack</h4>
  <div class="flex gap-4 text-xs font-medium">
    <div><strong>Framework:</strong> Angular 22</div>
    <div><strong>State Management:</strong> NgRx Signals 21</div>
    <div><strong>Test Runner:</strong> Vitest 4</div>
    <div><strong>Monorepo Engine:</strong> Nx 23</div>
    <div><strong>Mutation Engine:</strong> Stryker Core 9.6</div>
  </div>
</div>

<!--
Presenter Notes:
- Überblick über unseren realen Workspace: 5 Domain-Bibliotheken, 21 Quelldateien, 1.103 verarbeitete Mutanten.
-->

---
transition: fade-out
layout: two-cols
---

# Erste Schritte mit Stryker

### Schritt 1: Installation & Konfiguration

<div class="pr-3">
  <p class="text-xs font-medium mb-1">
    1. Kern-Abhängigkeiten installieren:
  </p>

```bash
npm install -D @stryker-mutator/core \
  @stryker-mutator/vitest-runner \
  @stryker-mutator/typescript-checker
```

  <p class="text-xs font-medium mt-2 mb-1">
    2. Projektkonfiguration initialisieren:
  </p>

```bash
npx stryker init
```
</div>

::right::

<div class="pl-3">

```json {all|2-4|6-10|12-19|all}
// stryker.config.json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "packageManager": "npm",
  "testRunner": "vitest",
  "coverageAnalysis": "perTest",
  "buildCommand": "npx nx run-many -t build --skip-nx-cache",
  "concurrency": 2,
  "incremental": true,
  "incrementalFile": "reports/stryker-incremental.json",
  "reporters": ["html", "json", "clear-text", "progress"],
  "thresholds": { "high": 80, "low": 60, "break": null },
  "mutate": [
    "packages/shop/*/src/lib/**/*.ts",
    "packages/shared/models/src/**/*.ts",
    "!packages/**/*.spec.ts"
  ],
  "htmlReporter": { "fileName": "reports/mutation/mutation.html" }
}
```

</div>

<!--
Presenter Notes:
- Hervorhebung `coverageAnalysis: "perTest"`: Stryker führt nur Tests aus, die die mutierte Zeile abdecken.
- Hervorhebung `incremental: true`: Cacht Ergebnisse, um unveränderten Code bei Folge-Commits zu überspringen.
-->

---
transition: slide-up
layout: default
---

# 🧠 Wissenstest: Kapitel 2

<QuizCard
  chapter="Kapitel 2"
  question="Warum ist 'coverageAnalysis: perTest' die wichtigste Konfigurationsoption für performantes Mutation Testing?"
  :options="[
    { key: 'A', text: 'Weil Stryker dadurch alle Unit Tests komplett überspringt.' },
    { key: 'B', text: 'Weil Stryker nur diejenigen Tests ausführt, die den mutierten Codeabschnitt tatsächlich abdecken.', correct: true, explanation: 'Exakt! Ohne perTest würde Stryker bei JEDEM Mutanten immer die GESAMTE Test-Suite durchlaufen. Das führt zu riesigen Laufzeit-Unterschieden!' },
    { key: 'C', text: 'Weil dadurch nur TypeScript-Typen überprüft werden.' },
    { key: 'D', text: 'Weil dadurch der Nx Build-Cache automatisch deaktiviert wird.' }
  ]"
/>

<!--
Presenter Notes:
- Kurze Diskussion: Was passiert ohne `perTest` bei 1.000 Mutanten und 500 Unit Tests? (500.000 Testläufe statt ~1.500).
-->

---
transition: fade-out
layout: cover
---

<div class="glass-card text-center p-8 accent-emerald">
  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Kapitel 3</span>
  <h1 class="text-3xl font-bold my-2">Performance & Enterprise CI/CD</h1>
  <p class="text-sm font-medium opacity-80 m-0">
    Von 15 Minuten auf <30s mit Incremental Caching, GitHub Actions Pipelines & Log-Bereinigung.
  </p>
</div>

<!--
Presenter Notes:
- Kapitel 3 behandelt die Skalierbarkeit in der Praxis.
-->

---
transition: slide-up
layout: default
---

# Performance-Architektur: Von 15 Minuten zu < 30 Sekunden

### Lösung des CI-Ausführungs-Engpasses

<div class="grid grid-cols-2 gap-3 mt-3">
  <div class="glass-card accent-rose" v-click>
    <h4 class="text-rose-300 font-semibold text-xs mb-1">Ursprüngliche Herausforderung: 15+ Minuten</h4>
    <p class="text-xs font-medium m-0">
      1.103 Mutanten bei jedem Commit von Grund auf zu testen, erzeugte lange CI-Feedback-Schleifen und verzögerte Pull Requests.
    </p>
  </div>

  <div class="glass-card accent-emerald" v-click>
    <h4 class="text-emerald-300 font-semibold text-xs mb-1">Technische Lösung: Incremental Caching</h4>
    <p class="text-xs font-medium m-0">
      Konfiguration von <code>"incremental": true</code> + GitHub Actions <code>actions/cache@v4</code> für <code>reports/stryker-incremental.json</code>.
    </p>
  </div>
</div>

<div class="glass-card accent-cyan mt-3" v-click>
  <h4 class="text-sky-300 font-semibold text-xs mb-1">Dual-Run Workflow-Strategie</h4>
  <div class="grid grid-cols-2 gap-3 text-xs font-medium">
    <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
      <strong class="text-sky-300">1. Incremental Mode (PRs & Commits)</strong>
      <p class="mt-1 m-0 opacity-80">
        Verwendet <code>stryker.config.json</code> mit Incremental Cache. Unveränderte Mutanten werden sofort übersprungen. Ausführungszeit: <strong>&lt; 30s</strong>.
      </p>
    </div>
    <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
      <strong class="text-purple-300">2. Full Workspace Mode (Nächtlicher Audit)</strong>
      <p class="mt-1 m-0 opacity-80">
        Ausgelöst via <code>npm run stryker:full</code> oder GitHub <code>workflow_dispatch</code> mit <code>full_run: true</code> für vollständige Workspace-Audits.
      </p>
    </div>
  </div>
</div>

<!--
Presenter Notes:
- Erklärung des Incremental Caching: Stryker hasht Quellcode- und Test-ASTs.
- Wenn sich weder Code noch Test geändert haben, wird das Ergebnis direkt aus dem Cache geladen.
-->

---
transition: fade
layout: two-cols
---

# Saubere CI-Pipeline & Step Summary Optimierung

### Best Practices für die Production Pipeline (`stryker.yml`)

<div class="pr-3">
  <div class="glass-card accent-violet mb-2" v-click>
    <h4 class="text-purple-300 font-semibold text-xs mb-0.5">1. Einzellauf-Report-Isolierung</h4>
    <p class="text-xs font-medium m-0">
      <code>/reports</code> zu <code>.gitignore</code> hinzugefügt & dynamische Artefakt-Benennung <code>stryker-report-run-${{ github.run_number }}</code>.
    </p>
  </div>

  <div class="glass-card accent-emerald" v-click>
    <h4 class="text-emerald-300 font-semibold text-xs mb-0.5">2. Unterdrückung von Step-Summary-Rauschen</h4>
    <p class="text-xs font-medium m-0">
      <code>GITHUB_STEP_SUMMARY: ""</code> im Stryker-Schritt gesetzt, um Log-Spam durch Vitest-Sub-Worker zu verhindern.
    </p>
  </div>
</div>

::right::

<div class="pl-3">

```yaml {all|6-12|14-17|19-27|all}
# .github/workflows/stryker.yml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4

  - name: Restore Stryker Cache
    uses: actions/cache@v4
    with:
      path: reports/stryker-incremental.json
      key: stryker-incremental-${{ runner.os }}-${{ github.sha }}

  - name: Run Stryker Mutation Testing
    env:
      GITHUB_STEP_SUMMARY: "" # Unterdrückt Log-Rauschen
    run: npx stryker run

  - name: Generate Clean Step Summary
    if: always()
    run: |
      echo "# 🧬 Stryker Summary" > $GITHUB_STEP_SUMMARY

  - name: Upload Single-Run HTML Artifact
    uses: actions/upload-artifact@v4
    with:
      name: stryker-report-run-${{ github.run_number }}
      path: reports/mutation/
```

</div>

<!--
Presenter Notes:
- Zeile 15 erklären: `GITHUB_STEP_SUMMARY: ""`
- Ohne diese Einstellung schreiben Vitest-Worker automatisch eigene Zusammenfassungen für jeden Mutanten-Durchlauf und überfluten das GitHub Actions Interface.
-->

---
transition: slide-up
layout: default
---

# 🧠 Wissenstest: Kapitel 3

<QuizCard
  chapter="Kapitel 3"
  question="Wie verhindert man in GitHub Actions, dass Vitest-Child-Prozesse 50+ doppelte Log-Karten in die Job-Summary schreiben?"
  :options="[
    { key: 'A', text: 'Indem man Vitest deinstalliert.' },
    { key: 'B', text: 'Indem man im Stryker-Schritt die Umgebungsvariable GITHUB_STEP_SUMMARY im Workflow leert.', correct: true, explanation: 'Sehr gut! Vitest prüft auf das Vorhandensein der Variable GITHUB_STEP_SUMMARY. Wenn sie im Schritt geleert wird, schreiben die Sub-Worker keine doppelten Summaries.' },
    { key: 'C', text: 'Indem man den GitHub Actions Runner neu startet.' },
    { key: 'D', text: 'Indem man die HTML-Reports deaktiviert.' }
  ]"
/>

<!--
Presenter Notes:
- Noch ein Tipp zur Praxis: Nach dem Stryker-Schritt schreiben wir eine eigene saubere Zusammenfassung in `GITHUB_STEP_SUMMARY`.
-->

---
transition: fade-out
layout: cover
---

<div class="glass-card text-center p-8 accent-rose">
  <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Kapitel 4</span>
  <h1 class="text-3xl font-bold my-2">Profi Best Practices & Master-Checkliste</h1>
  <p class="text-sm font-medium opacity-80 m-0">
    Schwellenwerte, Survivor-Beseitigung & deine Checkliste für erstklassige Test-Qualität.
  </p>
</div>

<!--
Presenter Notes:
- Kapitel 4 fasst die wichtigsten Leitlinien für die langfristige Integration in Teams zusammen.
-->

---
transition: fade
layout: two-cols
---

# Stryker Thresholds & Failure Rules

### Schrittweise Einführung im Team ohne CI-Blockaden

<div class="pr-3">
  <p class="text-xs font-medium mb-2">
    Schwellenwert-Konfiguration in <code>stryker.config.json</code>:
  </p>

  <ul class="text-xs font-medium space-y-2 pl-3">
    <li><strong class="text-emerald-400">high (80%):</strong> Ab dieser Mutation Score wird der HTML-Report in sattem Grün dargestellt.</li>
    <li><strong class="text-amber-400">low (60%):</strong> Fällt der Score darunter, schlägt der Report auf Gelb/Orange um.</li>
    <li><strong class="text-rose-400">break (null / 70%):</strong> Fällt der Score unter diesen Wert, bricht der CLI-Prozess abbricht. Setze am Anfang <code>"break": null</code>!</li>
  </ul>
</div>

::right::

<div class="pl-3">

```json
// stryker.config.json Threshold Rules
{
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": null
  }
}
```

<div class="glass-card accent-cyan mt-3 p-2.5">
  <h5 class="text-xs font-bold text-sky-300 m-0 mb-1">💡 Profi-Tipp für Teams</h5>
  <p class="text-xs font-medium m-0">
    Setze <code>"break": null</code> zu Beginn, damit Pull Requests nicht abbrechen, während das Team die Mutation-Reports prüft. Erhöhe den <code>break</code>-Wert schrittweise!
  </p>
</div>

</div>

<!--
Presenter Notes:
- Wichtig für die Praxis: Wenn man sofort 90% `break` erzwingt, brechen alle CI-Builds ab und das Team verliert die Motivation.
-->

---
transition: slide-left
layout: default
---

# Informationsquellen & Masterclass-Checkliste

<div class="grid grid-cols-2 gap-3 mt-4">
  <div class="glass-card accent-cyan">
    <h4 class="text-sky-300 font-semibold text-xs mb-1.5">Offizielle Dokumentation</h4>
    <ul class="text-xs font-medium space-y-1.5 pl-3">
      <li>📖 <a href="https://stryker-mutator.io/docs/stryker-js/introduction/" target="_blank" class="text-sky-300 underline">Stryker Mutator Handbuch</a></li>
      <li>⚡ <a href="https://stryker-mutator.io/docs/stryker-js/vitest-runner/" target="_blank" class="text-sky-300 underline">Stryker Vitest Runner Guide</a></li>
      <li>🏗️ <a href="https://nx.dev/recipes/other/stryker" target="_blank" class="text-sky-300 underline">Nx Monorepo Integrations-Guide</a></li>
      <li>🧪 <a href="https://vitest.dev/guide/" target="_blank" class="text-sky-300 underline">Vitest Testing Framework</a></li>
    </ul>
  </div>

  <div class="glass-card accent-emerald">
    <h4 class="text-emerald-300 font-semibold text-xs mb-1.5">Die 5 goldenen Regeln</h4>
    <ol class="text-xs font-medium space-y-1 list-decimal pl-4 m-0">
      <li><strong>Grenzwerte testen:</strong> Exakte Schwellenwerte (`1000`) testen, nicht nur Standardfälle.</li>
      <li><strong>Konkrete Werte prüfen:</strong> Rückgabewerte verifizieren statt generischem `toBeDefined()`.</li>
      <li><strong>Incremental Caching aktivieren:</strong> Feedback-Schleifen unter 30 Sekunden halten.</li>
      <li><strong>Isolierte Sandboxen nutzen:</strong> Vitest Test-Isolation sicherstellen.</li>
      <li><strong>Schwellenwert-Regeln anpassen:</strong> Mit `"break": null` starten & stetig steigern.</li>
    </ol>
  </div>
</div>

<div class="glass-card text-center mt-5 p-3">
  <h3 class="font-semibold text-base m-0">Glückwunsch! Du bist jetzt Stryker Mutation Testing Profi!</h3>
  <p class="text-xs font-medium mt-0.5 m-0 opacity-80">
    Repository: <code>github.com/kluth/cloud.kluth.stryker-demo</code> | Erstellt mit Slidev
  </p>
</div>

<!--
Presenter Notes:
- Gratulation an alle Teilnehmer!
- Ihr habt nun das nötige Rüstzeug, um unvollständige Tests systematisch zu eliminieren.
-->
