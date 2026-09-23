<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="container py-5">
    <header class="pb-3 mb-4 border-bottom d-flex align-items-center justify-content-between">
      <a href="/" class="d-flex align-items-center text-dark text-decoration-none gap-2">
        <span class="fs-4 fw-bold text-success">boodoo + Vue 3</span>
      </a>
      <span class="badge bg-success-soft text-success px-3 py-2 rounded-pill">Vite Starter</span>
    </header>

    <main class="p-5 mb-4 bg-light rounded-4 shadow-sm border text-center">
      <h1 class="display-5 fw-bold mb-3">Hello from boodoo in Vue 3!</h1>
      <p class="lead text-muted mx-auto mb-4" style="max-width: 600px">
        A lightweight Vue 3 starter with Single File Components and boodoo CSS integration ready to go.
      </p>
      <div class="d-flex justify-content-center gap-3">
        <button
          type="button"
          class="btn btn-success btn-lg rounded-pill px-4 shadow-sm"
          @click="count++"
        >
          Count is: {{ count }}
        </button>
        <a
          href="https://boodoo.dihadiwala.com/docs/getting-started/introduction.html"
          target="_blank"
          rel="noreferrer"
          class="btn btn-outline-secondary btn-lg rounded-pill px-4"
        >
          Documentation
        </a>
      </div>
    </main>

    <footer class="pt-3 text-muted border-top text-center small">
      <p class="mb-0"><span>© 2026 boodoo Framework. Built with Vue 3 &amp; Vite.</span></p>
    </footer>
  </div>
</template>
