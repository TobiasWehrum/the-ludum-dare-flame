import { observable, action } from "mobx";

export class TimeStore {
    @observable public time: number;

    constructor() {
        this.refresh();
    }

    @action.bound
    public refresh() {
        this.time = Date.now();
    }
}

const timeStore = new TimeStore();

const fps = 30;
setInterval(timeStore.refresh, 1000 / fps);

export { timeStore };