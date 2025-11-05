<template>
    <div ref="dropdownHolder" class="dropdown-holder" @click="toggleVisibility">
        <div class="dropdown-title">
            <div>{{ selectedItem.title }}</div>
            <div class="arrow-svg-container" :class="{ 'arrow-turn': isOptionsShown }">
                <svg width="10px" height="6px" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
        <transition name="fade">
            <div v-show="isOptionsShown" class="options-holder">
                <div v-for="option in options" :value="option.value" @click="selectItem(option)" class="option">
                    {{ option.title }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang=ts>
import type { PropType } from 'vue'

export interface OptionType {
    value: String,
    title: String
}

export default {
    props: {
        options: {
            type: Array as PropType<OptionType[]>,
            required: true,
        },
    },
    data() {
        return {
            isOptionsShown: false as boolean,
            selectedItem: this.options[0] as OptionType
        }
    },
    mounted() {
        window.addEventListener('click', this.closeOnBackdropClicks)
    },
    beforeUnmount() {
        window.removeEventListener('click', this.closeOnBackdropClicks)
    },
    methods: {
        selectItem(item: OptionType): void {
            this.selectedItem = item;
            this.$emit('select', item)
        },
        toggleVisibility(): void {
            this.isOptionsShown = !this.isOptionsShown
        },
        closeOnBackdropClicks(event: Event): void {
            if (event.target !== this.$refs.dropdownHolder
                && !event.composedPath().includes(this.$refs.dropdownHolder as EventTarget)
            ) {
                this.isOptionsShown = false;
            }
        }
    }
}
</script>

<style scoped>
.dropdown-holder {
    position: relative;
    display: block;
    width: 100%;
    border-radius: 8px;
    font-size: 15px;
    line-height: 20px;
    padding: 8px 12px;
    background: var(--vp-c-gray-soft);
    border: 1px solid var(--vp-c-gray-2);
}

.dropdown-holder:hover,
.dropdown-holder:focus-within {
    border: 1px solid var(--vp-c-brand-1);
}

.dropdown-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.options-holder {
    width: 100%;
    border-radius: 8px;
    z-index: 150;
    position: absolute;
    background-color: var(--vp-c-bg-elv);
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    border: 1px solid var(--vp-c-gray-1);
}

.option {
    padding: 5px 8px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    transition: .3s all;
}

.option:hover {
    background-color: var(--vp-c-default-soft);
    color: var(--vp-c-brand-1);
    transition: .3s all;
}

.arrow-svg-container {
    transition: .3s all;
}

.arrow-svg-container path {
    stroke: var(--vp-c-text-1);
}

.arrow-turn {
    transform: rotate(180deg);
    transition: .3s all;
}

.fade-enter-active,
.fade-leave-active {
    transition: .3s all;
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}
</style>