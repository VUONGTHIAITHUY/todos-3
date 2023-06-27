<template>
    <!-- eslint-disable -->
    <div class="container m-auto">

        <div class="w-full">
            <!-- list -->

            <section class="todo-list">
                <div class="py-10 border-b-4 border-black flex justify-between">
                    <div @click="openDialog" class="ml-4 cursor-pointer bg-primary-t p-4 rounded text-white font-bold h-25">
                        {{ t("todo.createTodo") }}
                    </div>
                    <div class="block md:flex gap-4 mr-8">
                        <div @click="onSort" class="mb-2 md:mb-0 custom-select">
                            <v-select :items="types" density="category" label="Types" variant="outlined"></v-select>
                        </div>
                        <div @click="onSearch" class="custom-select">
                            <v-text-field :loading="loading" density="compact" variant="outlined" label="Search templates"
                                append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTextValue"
                                v-on:keyup="onSearch"></v-text-field>
                        </div>
                    </div>


                </div>
                <div class="text-2xl font-bold p-8">{{ t("todo.todoList") }}</div>
                <div class="grid grid-cols-1 gap-4 px-4 height-list">
                    <div v-for="todo in todos" :key="todo.id" :class="`todo-item ${todo.isDone && 'done'}`">
                        <div class="flex justify-between w-full" @click="todo = todo">
                            <div>
                                <div class="flex">
                                    <label>
                                        <!-- <input type="checkbox" v-model="todo.isDone" @change="toggleComplete(todo.id)" /> -->
                                        <input type="checkbox" v-model="todo.isDone"
                                            @change="toggleComplete($event, todo.id)" />
                                        <span :class="`bubble ${todo.type}`"></span>
                                    </label>

                                    <div class="todo-content font-bold" v-html="todo.name"></div>
                                </div>
                                <div v-html="todo.description"></div>
                                <div class="text-xs py-4">{{ todo.startDate }}</div>

                            </div>

                            <div class="actions my-auto flex gap-2">
                                <div @click="deleteTodoConfirm(todo.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-8 h-8">
                                        <path fillRule="evenodd"
                                            d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                            clipRule="evenodd" />
                                    </svg>
                                </div>

                                <span @click="editTodo(todo)">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-8 h-8">
                                        <path
                                            d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                    </svg>

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <div class="text-center">
        <v-dialog v-model="confirmDialogVisible" width="auto">
            <v-card>
                <v-card-text>
                    {{ t("todo.areYouSure") }}
                </v-card-text>
                <v-card-actions>
                    <v-btn text @click="cancelDeletion">{{ t("todo.cancel") }}</v-btn>
                    <v-btn color="error" @click="confirmDeletion">{{ t("todo.delete") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogVisible" class="w-full lg:3/4 xl:w-2/3 pb-12 flex">
            <v-card class="create-todo p-8">
                <h3 class="font-bold text-2xl lg:text-4xl text-center pt-8">{{ t("todo.createTodo") }}</h3>
                <form @submit.prevent="saveTodo" class="px-8 pb-8">
                    <div class="block lg:flex w-full gap-8">

                        <div class="w-full lg:w-1/2 flex flex-col justify-between">
                            <div>
                                <h4 class="text-2xl">{{ isEditMode ? 'Edit Todo' : 'Add Todo' }}</h4>
                                <v-text-field label="Label" v-model="newTodo.name" variant="outlined"></v-text-field>
                            </div>
                            <div class="lg:mt-0">
                                <h4 class="text-2xl">{{ t("todo.dueDate") }}</h4>
                                <VueCtkDateTimePicker v-model="newTodo.startDate" />
                            </div>
                            <div>
                                <h4 class="text-2xl pt-4">{{ t("todo.pickACategory") }}</h4>
                                <div class="options">
                                    <label>
                                        <input type="radio" name="category" value="personal" v-model="newTodo.type" />
                                        <span class="bubble personal"></span>
                                        <div>{{ t("todo.personal") }}</div>
                                    </label>
                                    <label>
                                        <input type="radio" name="category" value="business" v-model="newTodo.type" />
                                        <span class="bubble business"></span>
                                        <div>{{ t("todo.business") }}</div>
                                    </label>

                                </div>
                            </div>
                        </div>
                        <div class="w-full lg:w-1/2 m-auto">
                            <h4 class="text-2xl pt-4">{{ t("todo.description") }}</h4>

                            <editor api-key="no-api-key" v-model="newTodo.description" />
                        </div>
                    </div>
                    <div class="w-1/2 m-auto mt-8">
                        <input type="submit" value="Lưu" :disabled="validate" />
                    </div>
                </form>
            </v-card>
        </v-dialog>
    </div>

    <v-snackbar v-model="showSnackbar" :location="'top'" :timeout="timeout">
        {{ snackbarMessage }}
        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="showSnackbar = false">
                {{ t("todo.close") }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
/* eslint-disable */
import { onMounted, ref, watch, computed } from "vue";
import Editor from '@tinymce/tinymce-vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import TodoModel from '@/models/TodoModel';
import { reactive } from "vue";
import { useI18n } from "vue-i18n";

export default {
    name: 'Todo list',
    components: {
        VueCtkDateTimePicker,
        Editor,

    },
    setup() {
        const { t } = useI18n({
            inheritLocale: true,
            useScope: "local"
        });

        const types = ['Personal', 'Business', 'Other'];

        const todos = reactive([]);
        const newTodo = reactive({
            id: null,
            name: '',
            description: '',
            type: 'personal',
            isDone: false,
            isNotify: false,
            startDate: new Date(),
            endDate: new Date(),
        });

        let dialogVisible = ref(false);
        let confirmDialogVisible = ref(false);
        let todoToDelete = ref(null);
        let isEditMode = ref(false);
        let showSnackbar = ref(false);
        let snackbarMessage = ref('');

        const openDialog = () => {
            setTimeout(() => {
                dialogVisible.value = true;
                isEditMode = false;
            }, 300);
        };

        const cancelDialog = () => {
            dialogVisible.value = false;
            isEditMode = false;
            resetNewTodo();
        };

        const onSearch = () => {
            alert('Function not available')
        };
        const onSort = () => {
            alert('Function not available')

        }
        const saveTodo = () => {
            if (isEditMode) {
                updateTodo();
            } else {
                addTodo();
            }
            resetNewTodo();
            dialogVisible.value = false;
        };

        const addTodo = () => {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            newTodo.id = randomId
            const todo = { ...newTodo };
            todos.push(todo);
            saveTodos();
            cancelDialog();
            resetNewTodo();
        };

        const validate = computed(() => {
            if (!newTodo ||
                newTodo.name.trim() === '' ||
                !newTodo.startDate ||
                newTodo.description.trim() === '')
                return true;
            return false;
        })

        const editTodo = (todo) => {
            newTodo.id = todo.id;
            newTodo.name = todo.name;
            newTodo.description = todo.description;
            newTodo.type = todo.type;
            newTodo.isNotify = todo.isNotify;
            newTodo.startDate = todo.startDate;
            newTodo.endDate = todo.endDate;
            dialogVisible.value = true;
            isEditMode = true;
        };

        const updateTodo = () => {
            const index = todos.findIndex((todo) => todo.id === newTodo.id);
            if (index !== -1) {
                todos[index] = { ...newTodo };
            }
        };

        const deleteTodoConfirm = (id) => {
            todoToDelete.value = id;
            confirmDialogVisible.value = true;
        };

        const toggleComplete = (event, id) => {
            const flag = event.currentTarget.checked;
            const index = todos.findIndex((todo) => todo.id === id);
            if (index) {
                const todo = todos.find((todo) => todo.id === id);
                todo.isDone = flag;
                todos.splice(index, 1, todo);
            }
            saveTodos();
        };

        const cancelDeletion = () => {
            todoToDelete.value = null;
            confirmDialogVisible.value = false;
        };

        const confirmDeletion = () => {
            const index = todos.findIndex((todo) => todo.id === todoToDelete.value);
            if (index >= 0) {
                todos.splice(index, 1);
            }
            todoToDelete.value = null;
            confirmDialogVisible.value = false;
        };

        const resetNewTodo = () => {
            newTodo.id = null;
            newTodo.name = '';
            newTodo.description = '';
            newTodo.type = 'personal';
            newTodo.isDone = false;
            newTodo.isNotify = false;
            newTodo.startDate = new Date();
            newTodo.endDate = new Date();
        };

        const loadTodos = () => {
            const storedTodos = localStorage.getItem('todos' || '');
            if (storedTodos) {
                todos.splice(0, todos.length, ...JSON.parse(storedTodos));
            }
        };

        const filteredTodos = computed(() => {

            let filtered = todos;

            if (filterType !== 'All') {
                filtered = filtered.filter(todo => todo.type === filterType);
            }

            if (searchName !== '') {
                const lowerCaseSearchName = searchName.toLowerCase();
                filtered = filtered.filter(todo => todo.name.toLowerCase().includes(lowerCaseSearchName));
            }

            return filtered;
        });

        const saveTodos = () => {
            localStorage.setItem('todos', JSON.stringify(todos));
        };

        loadTodos();

        setInterval(() => {
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const currentDate = new Date();
            todos.forEach((todo) => {
                const startDate = new Date(todo.startDate);
                if (startDate < currentDate && !todo.isDone) {
                    snackbarMessage.value = `Start Date of "${todo.name}" has passed`;
                    showSnackbar.value = true;
                }
            });
        }, 5000);

        
        return {
            types,
            todos,
            newTodo,
            dialogVisible,
            confirmDialogVisible,
            filteredTodos,
            showSnackbar,
            snackbarMessage,
            openDialog,
            cancelDialog,
            saveTodo,
            addTodo,
            editTodo,
            deleteTodoConfirm,
            cancelDeletion,
            confirmDeletion,
            toggleComplete,
            onSearch,
            onSort,
            t,
            validate,
            
        };
    }
}
</script>