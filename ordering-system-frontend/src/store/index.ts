import { createStore } from "vuex";
const store = createStore({
    state() {
        return {

        }
    },
    mutations: {
        increment(state) {
            console.log(state);
        }
    }
})

export default store