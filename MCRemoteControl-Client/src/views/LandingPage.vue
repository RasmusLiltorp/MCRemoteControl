<script lang="ts">
import LandingPageLogic from './LandingPage.ts'
import './LandingPage.css'
export default LandingPageLogic
</script>

<template>
<div class="titlebar">
    <button class="github-button" @click="openGitHub">
      <i class="fab fa-github"></i>
    </button>
  <div class="drag-region"></div>
  <div class="window-controls">
    <button class="minimize-button" @click="minimizeWindow">
      <i class="fas fa-minus"></i>
    </button>
    <button class="close-button" @click="closeWindow">
        <i class="fas fa-times"></i>
    </button>
  </div>
</div>    
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div class="card">
        <h2 class="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">MC Remote Control</h2>
        <div class="space-y-2 mb-6">
          <div class="flex flex-col sm:flex-row gap-2">
            <input 
              v-model="serverAddress" 
              placeholder="Enter Server IP..." 
              class="input-field"
            />
            <button 
              @click="connectToServer"
              class="btn"
            >
              Connect
            </button>
          </div>
        </div>
        
        <p 
          class="status-message"
        >
          {{ statusMessage }}
        </p>
        
        <div class="flex justify-center gap-4 my-6">
          <button 
            @click="startServer"
            class="btn"
          >
            Start Server
          </button>
          <button 
            @click="stopServer"
            class="btn"
          >
            Stop Server
          </button>
        </div>
        
        <button 
          @click="toggleSettings"
          class="toggle-btn"
        >
          ⚙️
        </button>
        
        <div v-if="showSettings" class="settings-popup">
          <h3 class="settings-heading">Settings</h3>
          <button 
            @click="generateKeys"
            class="w-full mb-2 btn"
          >
            Generate New Key Pair
          </button>
          <button 
            @click="copyPubKey"
            class="w-full mb-2 btn"
          >
            Copy Public Key
          </button>
          <button 
            @click="OpenFilePath"
            class="w-full mb-2 btn"
          >
            Open File Path
          </button>
          <button 
            @click="toggleSettings"
            class="secondary-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>