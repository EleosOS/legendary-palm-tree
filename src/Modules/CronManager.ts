import Cron from "croner";
import { CronOptions } from "croner/types/croner";
import { isValidCron } from "cron-validator";

class CronManagerClass {
    tasks: Map<string, Cron>;

    constructor() {
        this.tasks = new Map();
    }

    validate(cronExpression: string) {
        return isValidCron(cronExpression, {
            alias: true,
            allowBlankDay: true,
            seconds: false,
        });
    }

    addTask(name: string, pattern: string, func: Function, options?: CronOptions) {
        const task = Cron(pattern, options, func);

        this.tasks.set(name, task);

        return task;
    }

    removeTask(name: string) {
        const task = this.tasks.get(name);

        if (task) {
            task.stop();
            this.tasks.delete(name);

            return true;
        } else {
            return false;
        }
    }
}

export const CronManager = new CronManagerClass();
