import {Name} from "./Name";
import {AbstractName} from "./AbstractName";
import {ESCAPE_CHARACTER} from "../../adap-b02/common/Printable";
import {StringArrayName} from "../../adap-b02/names/StringArrayName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;

        this.noComponents = this.getNames().length;
    }

    private convertBackToString(san: StringArrayName): string {
        let str = ""
        for(let i = 0; i < san.getNoComponents(); i++) {
            str += san.getComponent(i) + this.delimiter;
        }
        return str.substring(0, str.length - 1);
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

    /*
    public clone(): Name {
        return super.clone();
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    public isEqual(other: Name): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getHashCode(): number {
        throw new Error("needs implementation or deletion");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation or deletion");
    }
     */

    public getNoComponents(): number {
        return this.noComponents
    }

    public getComponent(i: number): string {
        return (new StringArrayName(this.getNames(), this.delimiter)).getComponent(i);
    }

    public setComponent(i: number, c: string) {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.setComponent(i, c);
        this.name = this.convertBackToString(sac);
    }

    public insert(i: number, c: string) {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.insert(i, c)
        this.name = this.convertBackToString(sac);
        this.noComponents++;
    }

    public append(c: string) {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.append(c)
        this.name = this.convertBackToString(sac);
        this.noComponents++;
    }

    public remove(i: number) {
        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.remove(i)
        this.name = this.convertBackToString(sac);
        this.noComponents--;
    }

    /*
    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }
     */
}