export class Message {
    public content: string;
    public type: string;
    public time: string;

    constructor(content:string, type:string, time:string) {
        this.content = content;
        this.type = type;
        this.time = time;
    }
}
