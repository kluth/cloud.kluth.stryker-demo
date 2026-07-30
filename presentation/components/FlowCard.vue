<script setup lang="ts">
import { computed } from 'vue';

type AccentTheme = 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';

const props = withDefaults(
  defineProps<{
    step?: string | number;
    title?: string;
    description?: string;
    icon?: string;
    status?: string;
    accent?: AccentTheme;
    active?: boolean;
    hasConnector?: boolean;
    badge?: string;
  }>(),
  {
    step: '',
    title: '',
    description: '',
    icon: '',
    status: '',
    accent: 'cyan',
    active: false,
    hasConnector: false,
    badge: ''
  }
);

const themeClass = computed(() => `accent-${props.accent}`);
</script>

<template>
  <div class="flow-card-wrapper">
    <div
      class="flow-card"
      :class="[
        themeClass,
        { 'is-active': active, 'has-badge': badge || status }
      ]"
    >
      <!-- Step Badge Header -->
      <div class="flow-card-top">
        <div v-if="step || $slots.step" class="step-indicator">
          <slot name="step">{{ step }}</slot>
        </div>

        <div v-if="icon || $slots.icon" class="icon-container">
          <slot name="icon">
            <!-- Preset Icon SVGs -->
            <svg
              v-if="icon === 'code'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>

            <svg
              v-else-if="icon === 'mutant' || icon === 'bug'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="8" y="6" width="8" height="14" rx="4" />
              <path d="M19 7l-3 2" />
              <path d="M5 7l3 2" />
              <path d="M19 19l-3-2" />
              <path d="M5 19l3-2" />
              <path d="M20 13h-4" />
              <path d="M4 13h4" />
              <path d="M10 4l-1-2" />
              <path d="M14 4l1-2" />
            </svg>

            <svg
              v-else-if="icon === 'test' || icon === 'check'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>

            <svg
              v-else-if="icon === 'gear' || icon === 'process'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>

            <svg
              v-else-if="icon === 'report' || icon === 'chart'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>

            <!-- Default Zap Icon -->
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </slot>
        </div>

        <div v-if="badge || status || $slots.badge" class="badge-tag">
          <slot name="badge">{{ badge || status }}</slot>
        </div>
      </div>

      <!-- Card Title & Body -->
      <div class="flow-card-content">
        <h3 v-if="title || $slots.title" class="flow-card-title">
          <slot name="title">{{ title }}</slot>
        </h3>
        <p v-if="description || $slots.description" class="flow-card-desc">
          <slot name="description">{{ description }}</slot>
        </p>
        <div v-if="$slots.default" class="flow-card-body">
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- Pipeline Step Arrow Connector -->
    <div v-if="hasConnector" class="flow-connector" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.flow-card-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 220px;
}

.flow-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.25rem 1.4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.flow-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
}

/* Accent Themes */
.flow-card.accent-cyan {
  border-top: 3px solid #06b6d4;
}
.flow-card.accent-cyan:hover,
.flow-card.accent-cyan.is-active {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(6, 182, 212, 0.3);
}
.flow-card.accent-cyan .step-indicator {
  background: rgba(6, 182, 212, 0.2);
  color: #38bdf8;
  border-color: rgba(6, 182, 212, 0.4);
}

.flow-card.accent-violet {
  border-top: 3px solid #8b5cf6;
}
.flow-card.accent-violet:hover,
.flow-card.accent-violet.is-active {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(139, 92, 246, 0.3);
}
.flow-card.accent-violet .step-indicator {
  background: rgba(139, 92, 246, 0.2);
  color: #c084fc;
  border-color: rgba(139, 92, 246, 0.4);
}

.flow-card.accent-emerald {
  border-top: 3px solid #10b981;
}
.flow-card.accent-emerald:hover,
.flow-card.accent-emerald.is-active {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(16, 185, 129, 0.3);
}
.flow-card.accent-emerald .step-indicator {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.4);
}

.flow-card.accent-amber {
  border-top: 3px solid #f59e0b;
}
.flow-card.accent-amber:hover,
.flow-card.accent-amber.is-active {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(245, 158, 11, 0.3);
}
.flow-card.accent-amber .step-indicator {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.4);
}

.flow-card.accent-rose {
  border-top: 3px solid #f43f5e;
}
.flow-card.accent-rose:hover,
.flow-card.accent-rose.is-active {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(244, 63, 94, 0.3);
}
.flow-card.accent-rose .step-indicator {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.4);
}

.flow-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.step-indicator {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  line-height: 1;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
}

.icon-container svg {
  width: 1.2rem;
  height: 1.2rem;
}

.badge-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.flow-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.flow-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  line-height: 1.3;
}

.flow-card-desc {
  font-size: 0.825rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.45;
}

.flow-card-body {
  margin-top: 0.5rem;
}

.flow-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;
}

.flow-connector svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
