import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";
import {RootNode} from "./RootNode";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    private getRootNode(): RootNode {
        let rootNode: Node = this;

        while (!(rootNode instanceof RootNode)) {
            rootNode = rootNode.parentNode;
        }
        return rootNode as RootNode
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        let findings: Set<Node> = new Set<Node>();
        const root = this.getRootNode();

        function iter(node: Node) {
            if(node.baseName === "")
                throw new InvalidStateException("basename empty");
            if( node.baseName === bn) findings.add(node);
            if( node instanceof Directory) {
                for (const childNode of node.getChildNodes()) {
                    iter(childNode);
                }
            }
        }
        for (const node of root.getChildNodes()) {
            iter(node);
        }
        return findings;
    }

}
