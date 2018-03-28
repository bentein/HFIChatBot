export class Message {
  public content: string;
  public type: string;
  public time: string;
  public day: string;

  constructor(content: string, type: string) {
    this.content = content;
    this.type = type;
    this.time = this.getTime();
    this.day = getDay();
  }

  getTime() {
    let d = new Date();
    let hh = (d.getHours() < 10 ? '0' : '') + d.getHours();
    let mm = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

    let ret = hh + ":" + mm;

    return ret;
  }

}

export function getDay() {
  let days = {
    0: "Søndag",
    1: "Mandag",
    2: "Tirsdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
    6: "Lørdag"
  }
  let d = new Date();
  return days[d.getDay()];
}
