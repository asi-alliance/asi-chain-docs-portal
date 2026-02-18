<template>
    <div id="captcha-modal-container"></div>
    <div class="feedback-form-holder">
        <div class="feedback-form" :class="{ 'hidden': !isFormDisplayed }">
            <div class="form-header">
                <h2>Feedback form</h2>
                <button @click="toggleFormVisibility">
                    <svg xmlns="http://www.w3.org/2000/svg" id="close-icon" height="15px" width="15px"
                        viewBox="0 0 20 20">
                        <line x1="0" y1="00" x2="20" y2="20" stroke-linecap="round" />
                        <line x1="0" y1="20" x2="20" y2="0" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
            <form>
                <fieldset>
                    <div class="form-field">
                        <label for="category">
                            Support category
                        </label>
                        <DropdownList :options="options" @select="selectCategory" />
                    </div>
                    <div class="form-field">
                        <label for="name">
                            Name
                        </label>
                        <input id="name" v-model="name" placeholder="Enter your name" />
                    </div>
                    <div class="form-field">
                        <label for="email">
                            Email
                        </label>
                        <input id="email" :class="{ 'error-field': email && !isEmailValid(email) }" v-model="email"
                            placeholder="Enter your email" />
                    </div>
                    <div class="form-field">
                        <label for="Feedback">
                            Your text
                        </label>
                        <textarea id="Feedback" v-model="feedback" placeholder="Enter your text" />
                    </div>
                </fieldset>
                <div class="submit-btn-container" :class="{ 'gradient-border': isSubmitAvailable }">
                    <button class="submit-button" type="button" :disabled="!isSubmitAvailable || isRequestHandling"
                        @click="sendFeedback">
                        <SpriteIcon v-if="isRequestHandling" :textIconID="'double-check-icon'" :width="'35px'"
                            :height="'20px'" />
                        <span v-else>Submit</span>
                    </button>
                </div>
            </form>
        </div>
        <div class="ready-alert" :class="{ 'hidden': !isRequestSent }">Thank you!
            Our technical support will get in touch with you soon!</div>
        <div class="error-alert" :class="{ 'hidden': !isRequestErrored }">
            Something went wrong! Please, try again later
        </div>
        <div class="feedback-form-launcher" :class="{ 'hidden': isFormDisplayed }">
            <button @click="toggleFormVisibility">
                <img src="/images/common/asi-feedback-logo.png" alt="feedback" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import DropdownList, { OptionType } from './DropdownList.vue';
import { endpoints } from '../utils/constants';

const enum FeedbackCategory {
    QUESTION = 'question',
    BUG = 'bug',
    FEEDBACK = 'feedback',
}

const EMAIL_VALIDATION_REGEX: RegExp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const MINIMUM_FEEDBACK_LENGTH = 10;
const COMPLETED_SCREEN_TIMEOUT = 5000;

export default {
    data() {
        return {
            isRequestHandling: false as boolean,
            isRequestSent: false as boolean,
            isRequestErrored: false as boolean,
            isFormDisplayed: false as boolean,
            name: '' as string,
            email: '' as string,
            feedback: '' as string,
            category: FeedbackCategory.QUESTION,
            options: [
                { value: "question", title: "Question" },
                { value: "bug", title: "Bug" },
                { value: "feedback", title: "Feedback" },
            ] as OptionType[]
        }
    },
    components: {
        DropdownList
    },
    computed: {
        isSubmitAvailable(): boolean {
            return !!this.name
                && this.isEmailValid(this.email)
                && !!this.feedback
                && this.feedback?.trim().length >= MINIMUM_FEEDBACK_LENGTH
                && !!this.category
        },
    },
    methods: {
        isEmailValid(value: string): boolean {
            return EMAIL_VALIDATION_REGEX.test(value);
        },
        toggleFormVisibility(): void {
            this.isFormDisplayed = !this.isFormDisplayed;
        },
        selectCategory(option: OptionType): void {
            this.category = option.value as FeedbackCategory;
        },
        resetForm(): void {
            this.name = '';
            this.email = '';
            this.feedback = '';
            this.category = FeedbackCategory.QUESTION;
        },
        async showError(): Promise<void> {
            this.isRequestErrored = true;
            await new Promise(r => setTimeout(r, COMPLETED_SCREEN_TIMEOUT));
            this.isRequestErrored = false;
        },
        async showAlert(): Promise<void> {
            this.isRequestSent = true;
            await new Promise(r => setTimeout(r, COMPLETED_SCREEN_TIMEOUT));
            this.isRequestSent = false;
        },
        async sendFeedback(): Promise<void> {
            try {
                const options: RequestInit = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        source: "ASI_CHAIN_DOCS",
                        name: this.name,
                        address: "",
                        email: this.email,
                        phone_no: "",
                        message_type: this.category,
                        subject: "",
                        message: this.feedback,
                        attachment_details: {},
                    })
                };
                if (!this.isRequestHandling && this.$captcha.isReady) {
                    this.isRequestHandling = true;
                    await this.$captcha?.fetch?.(endpoints.FEEDBACK, options);
                }
                this.isFormDisplayed = false;
                await this.showAlert();
            } catch (error) {
                this.isFormDisplayed = false;
                console.error("error on feedback request: ", error);
                await this.showError();
            } finally {
                this.resetForm();
                this.isRequestHandling = false;
            }
        }
    }
}
</script>

<style scoped>
.feedback-form-holder {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 50px;
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 14;
}

.gradient-border::before {
    border-radius: 8px;
}

.feedback-form {
    max-height: 600px;
    border-radius: 8px;
    background: var(--vp-sidebar-bg-color);
    border: 1px solid var(--vp-c-gray-3);
    width: 400px;
    padding: 25px;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 16;
    transition: .3s all;
    box-shadow: 0 0 5px var(--vp-c-gray-soft);
}

.error-alert.hidden,
.ready-alert.hidden,
.feedback-form.hidden,
.feedback-form-launcher.hidden {
    visibility: hidden;
    overflow: hidden;
    padding: 0;
    width: 0;
    max-height: 0;
}

.feedback-form-launcher img {
    width: 55px;
}

.form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

fieldset,
form {
    border: none !important;
}

.form-header h2 {
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
}

.form-header svg {
    transition: .3s all;
}

.form-header svg:hover {
    transform: scale(1.3);
}

.form-header line {
    stroke-width: 2;
    stroke: var(--vp-c-text-1);
}

.form-header:hover line {
    stroke: var(--vp-c-brand-1);
}

.form-field {
    margin-bottom: 16px;
    position: relative;
}

.form-field label {
    font-size: 13px;
    line-height: 16px;
    margin-bottom: 7px;
    font-weight: 500;
    width: 100%;
}

.form-field input,
.form-field textarea,
.form-field select {
    display: block;
    width: 100%;
    border-radius: 8px;
    font-size: 15px;
    line-height: 20px;
    padding: 8px 12px;
    border: 1px solid var(--vp-c-gray-2);
    background: var(--vp-c-gray-soft);
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
    border: 1px solid var(--vp-c-brand-1);
}

.form-field select {
    appearance: auto;
}

.error-field {
    border: 1px solid var(--vp-c-danger-1) !important;
}

.submit-btn-container {
    position: relative;
}

.submit-btn-container .submit-button {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    padding: 8px 0;
    border-radius: 8px;
    width: 100%;
    cursor: pointer;
    color: white;
    background-color: var(--vp-c-brand-2);
}

.submit-btn-container .submit-button:hover {
    transition: .3s;
    background-color: var(--vp-c-brand-1);
}

.submit-button svg {
    margin: 0 auto;
}

.submit-button:disabled {
    background-color: var(--vp-c-gray-3);
    color: var(--vp-c-lightgray);
    pointer-events: none;
    opacity: .6;
}

.submit-button:hover {
    box-shadow: 0 0 10px var(--vp-accent-border);
}

.form-field textarea {
    min-height: 70px;
    max-height: 150px;
}

.feedback-form-launcher {
    z-index: 15;
    width: 100px;
    transition: .3s all;
}

.feedback-form-launcher:hover {
    transform: scale(1.05);
    transition: .3s;
}

.error-alert,
.ready-alert {
    width: 200px;
    position: absolute;
    right: 60px;
    bottom: 30px;
    padding: 10px;
    border-radius: 8px;
    transition: .3s all;
    backdrop-filter: blur(5px);
}

.error-alert {
    color: var(--vp-c-danger-3);
    background-color: var(--vp-c-danger-soft);
}

.ready-alert {
    color: var(--vp-c-gray-3);
    background-color: var(--vp-c-green-3);
}

@media (max-width: 450px) {
    .feedback-form {
        width: 100vw;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 0 10px var(--vp-accent-border);
    }

    .feedback-form-holder {
        right: 0;
        bottom: 0;
    }
}
</style>