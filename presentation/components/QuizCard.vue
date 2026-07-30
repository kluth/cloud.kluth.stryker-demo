<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  question: string;
  options: { key: string; text: string; correct?: boolean; explanation?: string }[];
  chapter?: string;
}>();

const selectedOption = ref<string | null>(null);
const showAnswer = ref(false);

function select(key: string) {
  selectedOption.value = key;
  showAnswer.value = true;
}

function reset() {
  selectedOption.value = null;
  showAnswer.value = false;
}
</script>

<template>
  <div class="glass-card quiz-container my-2 p-4 border-l-4 accent-violet">
    <div class="flex items-center justify-between mb-2">
      <span class="quiz-badge">
        🧠 Quiz {{ props.chapter ? `• ${props.chapter}` : '' }}
      </span>
      <button v-if="showAnswer" @click="reset" class="quiz-reset-btn">
        🔄 Zurücksetzen
      </button>
    </div>

    <h4 class="quiz-question text-sm font-bold mb-3">
      {{ props.question }}
    </h4>

    <div class="space-y-2">
      <div
        v-for="opt in props.options"
        :key="opt.key"
        :class="[
          'quiz-option',
          { 'selected': selectedOption === opt.key },
          { 'is-correct': showAnswer && opt.correct },
          { 'is-wrong': showAnswer && selectedOption === opt.key && !opt.correct }
        ]"
        @click="select(opt.key)"
      >
        <div class="flex items-start gap-2">
          <span class="option-key">{{ opt.key }}</span>
          <span class="option-text flex-1">{{ opt.text }}</span>
          <span v-if="showAnswer && opt.correct" class="badge-icon-correct">✅ Richtig</span>
          <span v-else-if="showAnswer && selectedOption === opt.key && !opt.correct" class="badge-icon-wrong">❌ Falsch</span>
        </div>

        <div v-if="showAnswer && opt.explanation" class="quiz-explanation text-xs mt-2 pt-1 border-t border-slate-700/30">
          💡 {{ opt.explanation }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  background: var(--bg-card-warm);
  border-radius: 0.85rem;
}

.quiz-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2em 0.6em;
  border-radius: 9999px;
  background: var(--pastel-lavender-bg);
  color: var(--pastel-lavender);
  border: 1px solid var(--border-warm);
}

.quiz-reset-btn {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2em 0.5em;
  border-radius: 0.35rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-warm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-reset-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-main);
}

.quiz-question {
  color: var(--text-heading);
  line-height: 1.3;
}

.quiz-option {
  padding: 0.55rem 0.85rem;
  border-radius: 0.6rem;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--border-warm);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
  color: var(--text-main);
}

:global(html.light) .quiz-option {
  background: #f8fafc !important;
  border-color: #cbd5e1 !important;
  color: #0f172a !important;
}

.quiz-option:hover {
  border-color: var(--pastel-sky);
  transform: translateX(2px);
}

.option-key {
  font-weight: 800;
  color: var(--pastel-sky);
  min-width: 1.2rem;
}

.quiz-option.is-correct {
  border-color: var(--pastel-mint) !important;
  background: rgba(6, 78, 59, 0.15) !important;
}

:global(html.light) .quiz-option.is-correct {
  background: #ecfdf5 !important;
  border-color: #a7f3d0 !important;
  color: #064e3b !important;
}

.quiz-option.is-wrong {
  border-color: var(--pastel-rose) !important;
  background: rgba(159, 18, 57, 0.15) !important;
}

:global(html.light) .quiz-option.is-wrong {
  background: #fff1f2 !important;
  border-color: #fecdd3 !important;
  color: #9f1239 !important;
}

.badge-icon-correct {
  font-weight: 700;
  color: var(--pastel-mint);
  font-size: 0.7rem;
}

.badge-icon-wrong {
  font-weight: 700;
  color: var(--pastel-rose);
  font-size: 0.7rem;
}

.quiz-explanation {
  color: var(--text-muted);
  font-style: italic;
}
</style>
