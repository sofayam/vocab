
export function niceDateString(inp: string): string {

    const creationData = parseInt(inp, 10);
    const creationDate = new Date(creationData);
    const creationString = creationDate.toString();
    const trimString = creationString.substring(0, 24);
    return trimString;
}
