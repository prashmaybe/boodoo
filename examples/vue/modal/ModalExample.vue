<script setup>
import { useDisclosure } from 'boodoo/vue';
import 'boodoo/css';

const { isOpen, onOpen, onClose } = useDisclosure();
</script>

<template>
  <div class="container py-5">
    <button type="button" class="btn btn-primary" @click="onOpen">
      <span>Open Vue Modal</span>
    </button>

    <div v-if="isOpen" class="modal d-block" role="dialog" aria-modal="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><span>Vue 3 Modal</span></h5>
            <button type="button" class="btn-close" aria-label="Close" @click="onClose"></button>
          </div>
          <div class="modal-body">
            <p><span>Reactive modal dialog powered by Boodoo Vue composables.</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>