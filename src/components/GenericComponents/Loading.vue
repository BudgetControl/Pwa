<template>
    <div v-if="show" class="loading-overlay m-10">
        <div class="loading-content">
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            <span class="loading-text">
                {{ text }}
                <span class="dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: 'Loading'
        }
    }
}
</script>

<style scoped>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.loading-text {
    font-size: 1.2em;
    font-weight: 600;
    color: #4a5568;
    display: flex;
    align-items: center;
}

.spinner {
    width: 40px;
    height: 40px;
    position: relative;
    margin-bottom: 10px;
}

.double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #10B981;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    animation: bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
    animation-delay: -1.0s;
}

.dots span {
    opacity: 0;
    animation: dot 1.5s infinite;
    animation-fill-mode: forwards;
}

.dots span:nth-child(2) {
    animation-delay: 0.5s;
}

.dots span:nth-child(3) {
    animation-delay: 1s;
}

@keyframes bounce {
    0%, 100% { 
        transform: scale(0);
    } 
    50% { 
        transform: scale(1.0);
    }
}

@keyframes dot {
    0% { 
        opacity: 0;
        transform: translateY(0);
    }
    25% { 
        opacity: 1;
        transform: translateY(-3px);
    }
    50% { 
        opacity: 1;
        transform: translateY(0);
    }
    75% { 
        opacity: 1;
        transform: translateY(3px);
    }
    100% { 
        opacity: 0;
        transform: translateY(0);
    }
}
</style>
