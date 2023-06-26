import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";


export default class TodoModel {
    id = 0;
    name = '';
    description = '';
    type = '';
    isDone = false;
    isNotify = false;
    startDate = new Date();
    endDate = new Date();
    createAt = new Date();

    setFrom(todo) {
        this.id = todo.id;
        this.name = todo.name;
        this.description = todo.description;
        this.type = todo.type;
        this.isNotify = todo.isNotify;
        this.startDate = todo.startDate;
        this.endDate = todo.endDate;
        this.createAt = todo.createAt;
        this.isDone = todo.isDone;
    }

    get rules() {
        return {
            id: {},
            name: { required, minLength: minLength(5) },
            description: {},
            type: { required },
            startDate: { required, minLength: minLength(5) },
            endDate: { required, minLength: minLength(5) },
            createAt: { required, minLength: minLength(5) },
        };
    }

    toModel() {
        return useVuelidate(this.rules, this);
    }
}