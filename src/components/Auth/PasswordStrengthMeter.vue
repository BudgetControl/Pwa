<!-- PasswordStrengthMeter.vue -->
<template>
  <div>
    <div class="w-full h-4 flex">
      <div :class="style"></div>
      <div class="flex-1 h-2"></div>
    </div>
    <div>{{ desc_strength }}</div>
  </div>
</template>
  
<script>
export default {
  props: {
    password: {
      required: true,
    }
  },
  watch: {
    password: 'checkPassword',
  },
  data() {
    return {
      strength: 0,
      desc: [
        'Very Weak',  // 0
        'Weak',       // 3
        'Moderate',   // 5
        'Strong',     // 7
        'Very Strong' // 9
      ],
      value:[
        'w-1 bg-red-500',           // 0
        'w-3 bg-red-300',           // 3
        'w-5 bg-orange-500',        // 5
        'w-7 bg-emerald-500',       // 7
        'w-9 bg-lightBlue-500',     // 9
      ]
    }
  },
  methods: {
    checkPassword() {
   
      this.strength = this.calculatePasswordScore(this.password);

      this.style = this.value[this.strength]
      this.desc_strength = this.desc[this.strength]

    },
    
    calculatePasswordScore(password) {
      // Calcola il punteggio in base a criteri specifici
      let score = 0;

      // Aggiungi punteggio per la lunghezza della password
      if (password.length <= 8) {
        score = 0;
      }

      // Aggiungi punteggio per la lunghezza della password
      if (password.length >= 8) {
        score += 1;
      }

      if (password.length >= 10) {
        score += 1;
      }

      if (password.length >= 13) {
        score += 1;
      }

      // Aggiungi punteggio per la presenza di caratteri speciali
      if (/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password) && password.length >= 8) {
        score += 3;
      }

      // Aggiungi punteggio per la presenza di numeri
      if (/\d/.test(password) && password.length >= 8) {
        score += 2;
      }

      // Aggiungi punteggio per la presenza di lettere maiuscole e minuscole
      if (/[a-z]/.test(password) && /[A-Z]/.test(password) && password.length >= 8) {
        score += 2;
      }

      return Math.min(score, 6); // Assicura che il punteggio sia al massimo 10
    },
  },
}
</script>

<style scoped>

.w-1 {
  width: 10%;
}

.w-3 {
  width: 30%;
}

.w-5 {
  width: 50%;
}

.w-7 {
  width: 70%;
}

.w-9 {
  width: 100%;
}
.w-10 {
  width: 100%;
}
</style>