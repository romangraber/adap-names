import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        return this;
    }

    public asString(delimiter: string = this.delimiter): string {
        let nArray: string[] = [];
        for(let i = 0; i < this.getNoComponents(); i++) {

            const searchDelimiter = ESCAPE_CHARACTER + delimiter;

            let component = this.getComponent(i);
            component.replaceAll(searchDelimiter, delimiter).replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);

            nArray.push(component);
        }

        return nArray.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let nArray: string[] = [];
        for(let i = 0; i < this.getNoComponents(); i++) {
            let component = this.getComponent(i);
            nArray.push(component);
        }

        return nArray.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        let hash = 0;
        for (const char of this.toString()) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0; // Constrain to 32bit integer
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() == 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isValidIndex(n: number) {
        return n >= 0 && n < this.getNoComponents();
    }

    public isValidComponent(s: string) {
        for (let i = 0; i < s.length; i++) {
            const char = s[i];

            if (char === this.getDelimiterCharacter()) {
                // Count backslashes before the delim
                let backslashCount = 0;
                for (let j = i - 1; j >= 0 && s[j] === ESCAPE_CHARACTER; j--) {
                    backslashCount++;
                }

                // If not escaped, we have a invalid component
                if (backslashCount % 2 === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for(let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i))
        }
    }
}