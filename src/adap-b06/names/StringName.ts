import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {StringArrayName} from "../../adap-b02/names/StringArrayName";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {InvalidStateException} from "../common/InvalidStateException";
import {MethodFailedException} from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;

        this.noComponents = this.getNames().length;

        const sourceLength: number = this.getNames(source).length;

        InvalidStateException.assert(this.noComponents >= 0);
        MethodFailedException.assert(this.name === source && this.noComponents === sourceLength);
    }

    private convertBackToString(san: StringArrayName): string {
        let str = ""
        for(let i = 0; i < san.getNoComponents(); i++) {
            str += san.getComponent(i) + this.delimiter;
        }
        return str.substring(0, str.length - 1);
    }

    private getNames(name: string = this.name): string[] {
        let current = "";
        let names: string[] = [];

        for (let i = 0; i < name.length; i++) {
            const char = name[i];

            if (char === this.delimiter) {
                // Count backslashes before the delim
                let backslashCount = 0;
                for (let j = i - 1; j >= 0 && name[j] === ESCAPE_CHARACTER; j--) {
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

    public getNoComponents(): number {
        const noComponents = this.noComponents;
        InvalidStateException.assert(noComponents >= 0);
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));
        return (new StringArrayName(this.getNames(), this.delimiter)).getComponent(i);
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.setComponent(i, c);
        this.name = this.convertBackToString(sac);

        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));

        MethodFailedException.assert(this.getComponent(i) === c);
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldLength = this.getNoComponents();

        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.insert(i, c)
        this.name = this.convertBackToString(sac);
        this.noComponents++;

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return this.clone() as StringName;
    }

    public append(c: string): StringName{
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldLength = this.getNoComponents();

        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.append(c)
        this.name = this.convertBackToString(sac);
        this.noComponents++;

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(newLength - 1);

        InvalidStateException.assert(this.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);
        return this.clone() as StringName;
    }

    public remove(i: number) {

        IllegalArgumentException.assert(this.isValidIndex(i));
        const oldLength = this.getNoComponents();

        let sac = new StringArrayName(this.getNames(), this.delimiter)
        sac.remove(i)
        this.name = this.convertBackToString(sac);
        this.noComponents--;

        MethodFailedException.assert(this.getNoComponents() === oldLength);

        return this.clone() as StringName;
    }
}