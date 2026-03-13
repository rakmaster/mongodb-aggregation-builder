<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    @keydown="handleKeydown"
    class="v-mab-syntax-textarea"
    :class="textareaClass"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :readonly="readonly"
    spellcheck="false"
  ></textarea>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  rows?: number | string
  disabled?: boolean
  readonly?: boolean
  textareaClass?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  rows: 10,
  disabled: false,
  readonly: false,
  textareaClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    const value = target.value
    
    const newValue = value.substring(0, start) + '  ' + value.substring(end)
    emit('update:modelValue', newValue)
    
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + 2
    }, 0)
  }
}
</script>

<style>
.v-mab-syntax-highlighted-textarea {
  position: relative;
  width: 100%;
  display: inline-block;
}

.v-mab-syntax-textarea {
  width: 100%;
  min-height: 200px;
  margin: 0;
  padding: 12px;
  outline: none;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  tab-size: 2;
  box-sizing: border-box;
  /* Contenteditable specific styles */
  display: block;
  resize: vertical;
  /* Ensure identical rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  /* Prevent Vuetify overrides */
  font-weight: 400 !important;
  letter-spacing: normal !important;
  /* Contenteditable behavior */
  -webkit-user-modify: read-write-plaintext-only;
  -moz-user-modify: read-write-plaintext-only;
  user-modify: read-write-plaintext-only;
  /* Make sure Prism styles are visible */
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-mab-syntax-textarea:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.v-mab-syntax-textarea.text-error {
  border-color: #d32f2f;
}

.v-mab-syntax-textarea.text-error:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.2);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .v-mab-syntax-textarea {
    caret-color: rgba(255, 255, 255, 0.87);
    color: rgba(255, 255, 255, 0.87) !important;
  }

  .v-mab-syntax-textarea:focus {
    border-color: #90caf9;
    box-shadow: 0 0 0 2px rgba(144, 202, 249, 0.2);
  }

  .v-mab-syntax-textarea.text-error {
    border-color: #f48fb1;
  }

  .v-mab-syntax-textarea.text-error:focus {
    border-color: #f48fb1;
    box-shadow: 0 0 0 2px rgba(244, 143, 177, 0.2);
  }
}

/* Prism syntax highlighting styles - make sure they're applied to our contenteditable */
.v-mab-syntax-textarea .token.comment,
.v-mab-syntax-textarea .token.prolog,
.v-mab-syntax-textarea .token.doctype,
.v-mab-syntax-textarea .token.cdata {
  color: hsl(30, 20%, 50%);
}

.v-mab-syntax-textarea .token.punctuation {
  color: hsl(0, 0%, 50%);
}

.v-mab-syntax-textarea .token.property,
.v-mab-syntax-textarea .token.tag,
.v-mab-syntax-textarea .token.boolean,
.v-mab-syntax-textarea .token.number,
.v-mab-syntax-textarea .token.constant,
.v-mab-syntax-textarea .token.symbol,
.v-mab-syntax-textarea .token.deleted {
  color: hsl(220, 14%, 51%);
}

.v-mab-syntax-textarea .token.selector,
.v-mab-syntax-textarea .token.attr-name,
.v-mab-syntax-textarea .token.string,
.v-mab-syntax-textarea .token.char,
.v-mab-syntax-textarea .token.builtin,
.v-mab-syntax-textarea .token.inserted {
  color: hsl(119, 34%, 47%);
}

.v-mab-syntax-textarea .token.operator,
.v-mab-syntax-textarea .token.entity,
.v-mab-syntax-textarea .token.url,
.v-mab-syntax-textarea .token.variable {
  color: hsl(207, 82%, 66%);
}

.v-mab-syntax-textarea .token.atrule,
.v-mab-syntax-textarea .token.attr-value,
.v-mab-syntax-textarea .token.keyword {
  color: hsl(301, 63%, 40%);
}

.v-mab-syntax-textarea .token.function,
.v-mab-syntax-textarea .token.class-name {
  color: hsl(5, 74%, 59%);
}

.v-mab-syntax-textarea .token.regex,
.v-mab-syntax-textarea .token.important {
  color: #e90;
}

/* Ensure contenteditable cursor behavior */
.v-mab-syntax-textarea[contenteditable]:focus {
  caret-color: rgba(0, 0, 0, 0.87);
}

@media (prefers-color-scheme: dark) {
  .v-mab-syntax-textarea[contenteditable]:focus {
    caret-color: rgba(255, 255, 255, 0.87);
  }
}
</style>
