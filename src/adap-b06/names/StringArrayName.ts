import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {MethodFailedException} from "../common/MethodFailedException";
import {InvalidStateException} from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source;

        MethodFailedException.assert(this.components === source);
    }

    public clone(): Name {
        return new StringArrayName(this.components, super.getDelimiterCharacter());
    }

    public getNoComponents(): number {
        InvalidStateException.assert(this.components.length >= 0);

        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndex(i));
        const component = this.components[i];

        InvalidStateException.assert(this.isValidComponent(component));

        return component;
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        let clone = this.clone() as StringArrayName;

        clone.components[i] = c;

        const newComponent: string = clone.getComponent(i);

        InvalidStateException.assert(clone.isValidComponent(newComponent));

        MethodFailedException.assert(clone.getComponent(i) === c);

        return clone;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        let clone = this.clone() as StringArrayName;

        const oldLength = clone.getNoComponents();

        this.components.splice(i, 0, c);

        const newLength: number = clone.getNoComponents();
        const newComponent: string = clone.getComponent(i);

        InvalidStateException.assert(clone.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return clone;
    }

    public append(c: string): StringArrayName {

        IllegalArgumentException.assert(this.isValidComponent(c));

        let clone = this.clone() as StringArrayName;

        const oldLength = clone.getNoComponents();
        clone.components.push(c);

        const newLength: number = clone.getNoComponents();
        const newComponent: string = clone.getComponent(newLength - 1);

        InvalidStateException.assert(clone.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return clone;
    }

    public remove(i: number) {
        IllegalArgumentException.assert(this.isValidIndex(i));

        let clone = this.clone() as StringArrayName;

        const oldLength = clone.getNoComponents();
        clone.components.splice(i, 1);

        MethodFailedException.assert(clone.getNoComponents() === oldLength);

        return clone;
    }
}