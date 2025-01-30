<script setup>
import { ref, computed, onMounted } from "vue";

const tasks = ref([]);
const newTask = ref("");
const editingTaskIndex = ref(null); // نستخدم ref علشان نخزن index المهمة اللي بنعدلها
const editTask = ref(""); // نستخدم ref علشان نخزن النص الجديد للمهمة

onMounted(() => {
    const loadTasks = () => {
        const savedTasks = localStorage.getItem("tasks");
        try {
            tasks.value = savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error("Failed to parse tasks from localStorage:", error);
            tasks.value = [];
        }
    };

    loadTasks();
});

const totalTasks = computed(() => tasks.value.length);

// const doneTasksCount = computed(() => tasks.value.filter((task) => task.completed).length);

const doneTasksCount = computed(() => {
    return Array.isArray(tasks.value)
        ? tasks.value.filter((task) => task.done).length
        : 0;
});

const addTask = () => {
    if (newTask.value.trim()) {
        tasks.value.push({ text: newTask.value, done: false });
        newTask.value = "";
        saveTasks();
    }
}

const startEditingTask = (index) => {
    editingTaskIndex.value = index; // نخزن index المهمة اللي بنعدلها
    editTask.value = tasks.value[index].text; // نخزن النص الحالي للمهمة
}

const saveTask = (index) => {
    if (editTask.value.trim() !== '') { // نتأكد أن النص الجديد مش فارغ
        tasks.value[index].text = editTask.value; // نعدل النص
        editingTaskIndex.value = null; // نرجع القيمة لـ null علشان نخفي حقل التعديل
        editTask.value = ''; // نمسح النص من حقل التعديل
        saveTasks(); // نحفظ التعديلات في localStorage
    }
}

const removeTask = (index) => {
    tasks.value.splice(index, 1);
    saveTasks();
}

const deleteTasksDone = () => {
    tasks.value = tasks.value.filter((task) => !task.done);
    saveTasks();
};

const removeTasks = (index) => {
    tasks.value.splice(index);
    saveTasks();
}

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
}

const editTask = (task) => {
    tasks.value[tasks.value.findIndex((task) => task.text === newTask.value)].text =
        newTask.value;
    saveTasks();
}
</script>

<template>
    <section class="container">
        <h1 class="title">Vue ToDo List</h1>
        <div v-if="editingTaskIndex === index" class="bg-white opacity-5
            flex flex-col pt-20 absolute rounded-lg shadow-lg p-6 h-60 w-11/12 max-w-md">
            <label class="flex align-center justify-start space-y-3" for="Edit task">
                Edit task
            </label>
            <input type="text" id="Edit_task" v-model="editTask" placeholder="Edit task"
                class="w-full p-2 rounded-lg border border-gray-400" />
            <button @click="saveTask(index)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save
            </button>
        </div>

        <div class="wrapper">
            <!-- buttons -->
            <div class="buttons text-sm md:text-lg ">
                <div class="cursor-auto button button-blue">
                    <button>
                        Tasks
                        <span>{{ totalTasks }}</span>
                    </button>
                </div>
                <div class="button button-blue">
                    <button>
                        Tasks Done
                        <span>{{ doneTasksCount }}</span>
                    </button>
                </div>
                <div v-if="doneTasksCount > 0" class=" cursor-pointer hover:bg-red-700 button button-red">
                    <button @click="deleteTasksDone()">
                        <i class="pi pi-trash pr-1"></i> Tasks Done
                    </button>
                </div>
                <div class=" cursor-pointer hover:bg-red-700 transition-opacity button button-red">
                    <button @click="removeTasks()">
                        <i class="pi pi-trash pr-1"></i>Tasks
                    </button>
                </div>
            </div>

            <!-- tasks list -->
            <div class="task-list justify-center">
                <div v-for="(task, index) in tasks" :key="index" class="task-item hover:bg-gray-200 transition-15s">
                    <div class="task-details hover:bg-gray-200 text-center">
                        <div class="text-center flex items-center">
                            <input type="checkbox" v-model="task.done" @change="saveTasks"
                                class="rounded-full w-4 h-4 checkbox hover:bg-gray-400" />
                            <span :class="{ 'line-through': task.done }">{{ task.text }}</span>
                        </div>
                        <div class="flex gap-4">
                            <i @click="startEditingTask(index, task.text)"
                                class="pi pi-file-edit w-5 h-7 text-2xl text-blue-700"></i>

                            <i @click="removeTask(index)" class="pi pi-trash w-5 h-7  text-2xl text-red-700 "></i>
                        </div>
                    </div>

                    <div v-if="editingTaskIndex === index"
                        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div v-if="editingTaskIndex === index"
                            class="task-module bg-white opacity-1 flex justify-self-center self-center justify-center align-center flex-col pt-10 position-center gap-2 absolute rounded-lg shadow-lg p-6 h-60 w-11/12 max-w-md">
                            <h1 class=" mb-4 text-3xl">Edit Task</h1>
                            <label class="flex align-center justify-start space-y-3" for="Edit task">
                                Task Name
                            </label>
                            <input type="text" id="Edit_task" v-model="editTask" @keyup.enter="saveTask(index)"
                                placeholder="Edit task" class="w-full p-2 rounded-lg border border-gray-400" />
                            <button @click="saveTask(index)"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- task input -->
            <div class="task-input">
                <div class="input-wrapper">
                    <input v-model="newTask" @keyup.enter="addTask" placeholder="New task" class="input" />
                    <button @click="addTask" class="add-button">
                        <i class="pi pi-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
body {
    height: 100vh;
    background: linear-gradient(0deg, #35495e, #41b482) !important;
    justify-items: center;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.title {
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
    color: white;
    padding-bottom: 1rem;
}

.wrapper {
    display: flex;
    background-color: #f9fafb;
    padding: 2rem 1.1rem;
    height: 25rem;
    min-width: 40vw;
    margin: 1rem;
    flex-direction: column;
    justify-content: space-between;
}

.buttons {
    padding: 0.2rem;
    display: flex;
    gap: 1rem;
    color: white;
    /* font-size: 0.9rem; */
    flex-direction: row;
    justify-content: center;
    margin-bottom: 0.5rem;
}

.button {
    padding: 0.4rem;
    border-radius: 0.5rem;
}

.button-blue {
    background-color: #2563eb;
}


.button-red {
    background-color: #dc2626;
}

.button span {
    background-color: white;
    color: #2563eb;
    padding: 0.25rem;
    border-radius: 9999px;
}

.task-list {
    margin-bottom: 1rem;
    overflow-y: scroll;
    max-height: 18rem;
    height: inherit;
}

.task-item {
    border-radius: 5px;
    cursor: pointer;
    margin: 0.7rem;
    display: flex;
    /* gap: 1rem; */
    align-items: center;
    border-radius: 10px;
    justify-content: space-between;
    padding: 0.5rem;
    /* border-bottom: 1px solid #e5e7eb; */
    outline: solid;
    outline-width: 2px;
    outline-color: #d1d5db;
    ;
    outline-style: solid;
    padding: 1rem;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.task-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: -webkit-fill-available;
}

.checkbox {
    cursor: pointer;
    margin-right: 0.5rem;
    /* color: #2563eb; */
    border: 1px solid;
}

.line-through {
    text-decoration: line-through;
    color: #9ca3af;
}


.task-input {
    border: 2px solid #2563eb;
    background-color: white;
    padding: 0.45rem;
    border-radius: 25px;
    box-sizing: border-box;
    margin: 0.5rem;
}

.input-wrapper {
    display: flex;
    gap: 0.75rem;
}

.input {
    flex: 1;
    padding: 0.2rem;
    outline: none;
}

.add-button {
    padding: 0.5rem 1rem;
    background-color: #2563eb;
    color: white;
    border-radius: 9999px;
    cursor: pointer;
}
</style>