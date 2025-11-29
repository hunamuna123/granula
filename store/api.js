import { defineStore } from 'pinia'

// Константа для использования без Pinia контекста
export const API_URL = 'https://api.granula.raitokyokai.tech/'

export const api = defineStore('apiUrl', {
	state: () => ({
		url: API_URL,
	}),
})
