<script setup lang="ts">
import { computed } from 'vue';

type MutantStatus = 'KILLED' | 'SURVIVED' | 'NO_COVERAGE' | 'COMPILE_ERROR' | string;
type BadgeSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    status?: MutantStatus;
    label?: string;
    size?: BadgeSize;
    iconOnly?: boolean;
  }>(),
  {
    status: 'KILLED',
    label: '',
    size: 'md',
    iconOnly: false
  }
);

// Normalize status key
const normalizedStatus = computed(() => {
  const raw = (props.status || '').toUpperCase().trim().replace(/[\s_-]+/g, '_');
  if (raw.includes('KILL')) return 'KILLED';
  if (raw.includes('SURVIV')) return 'SURVIVED';
  if (raw.includes('NO_COV') || raw.includes('NOCOV')) return 'NO_COVERAGE';
  if (raw.includes('COMPILE') || raw.includes('ERROR')) return 'COMPILE_ERROR';
  return raw || 'KILLED';
});

// Display text
const displayLabel = computed(() => {
  if (props.label) return props.label;
  switch (normalizedStatus.value) {
    case 'KILLED':
      return 'Killed';
    case 'SURVIVED':
      return 'Survived';
    case 'NO_COVERAGE':
      return 'No Coverage';
    case 'COMPILE_ERROR':
      return 'Compile Error';
    default:
      return props.status;
  }
});

const badgeClasses = computed(() => {
  return [
    'mutant-badge',
    `status-${normalizedStatus.value.toLowerCase().replace(/_/g, '-')}`,
    `size-${props.size}`,
    { 'icon-only': props.iconOnly }
  ];
});
</script>

<template>
  <span :class="badgeClasses" :title="displayLabel">
    <span class="badge-icon" aria-hidden="true">
      <!-- KILLED ICON -->
      <svg
        v-if="normalizedStatus === 'KILLED'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>

      <!-- SURVIVED ICON -->
      <svg
        v-else-if="normalizedStatus === 'SURVIVED'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>

      <!-- NO_COVERAGE ICON -->
      <svg
        v-else-if="normalizedStatus === 'NO_COVERAGE'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>

      <!-- COMPILE_ERROR ICON -->
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </span>

    <span v-if="!props.iconOnly" class="badge-text">
      <slot>{{ displayLabel }}</slot>
    </span>
  </span>
</template>

<style scoped>
.mutant-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 700;
  letter-spacing: 0.01em;
  border-radius: 9999px;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon svg {
  width: 0.95em;
  height: 0.95em;
}

.size-sm { padding: 0.22em 0.6em; font-size: 0.725rem; }
.size-md { padding: 0.3em 0.85em; font-size: 0.825rem; }
.size-lg { padding: 0.4em 1.05em; font-size: 0.95rem; }

/* Dark Mode Colors (High Contrast) */
.status-killed {
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
  border-color: rgba(110, 231, 183, 0.35);
}

.status-survived {
  background: rgba(244, 63, 94, 0.18);
  color: #fca5a5;
  border-color: rgba(252, 165, 165, 0.35);
}

.status-no-coverage {
  background: rgba(245, 158, 11, 0.18);
  color: #fde047;
  border-color: rgba(253, 224, 71, 0.35);
}

.status-compile-error {
  background: rgba(139, 92, 246, 0.18);
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.35);
}

/* Light Mode Overrides (WCAG AAA Strict Contrast >= 7:1) */
:global(html.light) .status-killed {
  background: #ecfdf5 !important;
  color: #064e3b !important; /* Contrast 7.5:1 */
  border-color: #a7f3d0 !important;
}

:global(html.light) .status-survived {
  background: #fff1f2 !important;
  color: #9f1239 !important; /* Contrast 7.4:1 */
  border-color: #fecdd3 !important;
}

:global(html.light) .status-no-coverage {
  background: #fefce8 !important;
  color: #78350f !important; /* Contrast 7.5:1 */
  border-color: #fef08a !important;
}

:global(html.light) .status-compile-error {
  background: #f3e8ff !important;
  color: #5b21b6 !important; /* Contrast 7.8:1 */
  border-color: #ddd6fe !important;
}
</style>
