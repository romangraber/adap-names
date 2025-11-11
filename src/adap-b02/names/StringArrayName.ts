import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.delimiter = delimiter || DEFAULT_DELIMITER;
        this.components = source;
    }

    public asString(delimiter: string = this.delimiter): string {

        // create a copy so we don't adjust the existing components
        let copyComponents = [...this.components]

        // iterate over every component
        copyComponents.forEach((component) => {

            //
            const searchDelimiter = ESCAPE_CHARACTER + delimiter;

            return component.replaceAll(searchDelimiter, delimiter).replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
        })
        return copyComponents.join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for(let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i))
        }
    }
}