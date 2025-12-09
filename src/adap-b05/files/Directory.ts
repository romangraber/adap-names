import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public getChildNodes(): Set<Node> {
        return this.childNodes;
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    protected override doFindNodes(bn: string): Set<Node> {

        const findings: Set<Node> = super.findNodes(bn);

        this.childNodes.forEach(child => {
            const res: Set<Node> = child.findNodes(bn);

            res.forEach(rs => findings.add(rs));
        });

        return findings;
    }

}