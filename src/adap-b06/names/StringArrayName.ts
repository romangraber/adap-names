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

        this.components[i] = c;

        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));

        MethodFailedException.assert(this.getComponent(i) === c);
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(this.isValidIndex(i));
        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldLength = this.getNoComponents();

        this.components.splice(i, 0, c);

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(i);

        InvalidStateException.assert(this.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return this.clone() as StringArrayName;
    }

    public append(c: string): StringArrayName {

        IllegalArgumentException.assert(this.isValidComponent(c));

        const oldLength = this.getNoComponents();
        this.components.push(c);

        const newLength: number = this.getNoComponents();
        const newComponent: string = this.getComponent(newLength - 1);

        InvalidStateException.assert(this.isValidComponent(newComponent));

        MethodFailedException.assert(newLength === oldLength + 1 && newComponent === c);

        return this.clone() as StringArrayName;
    }

    public remove(i: number) {
        IllegalArgumentException.assert(this.isValidIndex(i));

        const oldLength = this.getNoComponents();
        this.components.splice(i, 1);

        MethodFailedException.assert(this.getNoComponents() === oldLength);
    }
}