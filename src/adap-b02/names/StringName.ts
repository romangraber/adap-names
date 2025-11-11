import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {StringArrayName} from "./StringArrayName";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.delimiter = delimiter || DEFAULT_DELIMITER;
        this.name = source;
    }

    private getNames(): string[] {
        let current = "";
        let names: string[] = [];

        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];

            if (char === this.delimiter) {
                // Count backslashes before the delim
                let backslashCount = 0;
                for (let j = i - 1; j >= 0 && this.name[j] === ESCAPE_CHARACTER; j--) {
                    backslashCount++;
                }

                // If not escaped, split here
                if (backslashCount % 2 === 0) {
                    names.push(current);
                    current = "";
                    continue;
                }
            }

            current += char;
        }
        names.push(current);
        return names;
    }

    private convertBackToString(san: StringArrayName): string {
        let str = ""
        for(let i = 0; i < san.getNoComponents(); i++) {
            str += san.getComponent(i) + this.delimiter;
        }
        return str.substring(0, str.length - 1);
    }

    public asString(delimiter: string = this.delimiter): string {

        let sac = new StringArrayName(this.getNames(), this.delimiter)

        return sac.asString(delimiter);
    }

    public asDataString(): string {
        return (new StringArrayName(this.getNames(), this.delimiter)).asDataString();
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getNoComponents(): number {
        return (new StringArrayName(this.getNames(), this.delimiter)).getNoComponents();
    }

    public getComponent(x: number): string {
        return (new StringArrayName(this.getNames(), this.delimiter)).getComponent(x);
    }

    public setComponent(i: number, c: string): void {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.setComponent(i, c);
        this.name = this.convertBackToString(sac);

    }

    public insert(n: number, c: string): void {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.insert(n, c)
        this.name = this.convertBackToString(sac);

    }

    public append(c: string): void {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.append(c)
        this.name = this.convertBackToString(sac);
    }

    public remove(n: number): void {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.remove(n)
        this.name = this.convertBackToString(sac);
    }

    public concat(other: Name): void {
        this.name += this.delimiter + other.asDataString();
    }

}