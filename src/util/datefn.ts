import * as moment from "moment";

export function niceDateString(inp: string): string {

    const creationData = parseInt(inp, 10);
    const creationDate = new Date(creationData);
    const creationString = creationDate.toString();
    const trimString = creationString.substring(0, 24);
    return trimString;
}

export function fromNow(inp: string): string {
    const n = parseInt(inp, 10);
    const fnow = moment.unix(n / 1000).fromNow();
    return fnow;
}