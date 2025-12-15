import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {StringArrayName} from "./StringArrayName";
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

        let clone = this.clone() as StringName;

        let sac = new StringArrayName(clone.getNames(), clone.delimiter)
        sac.setComponent(i, c);
        clone.name = clone.convertBackToString(sac);

        const newComponent: string = clone.getComponent(i);

        InvalidStateException.assert(clone.isValidComponent(newComponent));

        MethodFailedException.assert(clone.getComponent(i) === c);

        return clone;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));


        let clone = this.clone() as StringName;

        const oldLength = clone.getNoComponents();



        let sac = new StringArrayName(clone.getNames(), clone.delimiter)
        sac.insert(i, c)
        clone.name = clone.convertBackToString(sac);
        clone.noComponents++;

        const newLength: number = clone.getNoComponents();
        const newComponent: string = clone.getComponent(i);

        InvalidStateException.assert(clone.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return clone;
    }

    public append(c: string): StringName{
        IllegalArgumentException.assert(this.isValidComponent(c));

        let clone = this.clone() as StringName;

        const oldLength = clone.getNoComponents();

        let sac = new StringArrayName(clone.getNames(), clone.delimiter)
        sac.append(c)
        clone.name = this.convertBackToString(sac);
        clone.noComponents++;

        const newLength: number = clone.getNoComponents();
        const newComponent: string = clone.getComponent(newLength - 1);

        InvalidStateException.assert(clone.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);
        return clone;
    }

    public remove(i: number) {

        let clone = this.clone() as StringName;

        IllegalArgumentException.assert(clone.isValidIndex(i));
        const oldLength = clone.getNoComponents();

        let sac = new StringArrayName(clone.getNames(), clone.delimiter)
        sac.remove(i)
        clone.name = clone.convertBackToString(sac);
        clone.noComponents--;

        MethodFailedException.assert(clone.getNoComponents() === oldLength);

        return clone;
    }
}