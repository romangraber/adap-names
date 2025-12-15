import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("Basic StringName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss.fau.de");
        const n1: Name = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.fau.de");
        expect(n1.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringName("oss.cs.fau");
        const n2: Name = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau");
        expect(n2.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringName("oss.cs.fau.de");
        const n3: Name = n.remove(0);
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(n3.asString()).toBe("cs.fau.de");
    });
});

describe("Basic StringArrayName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        const n1: Name = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.fau.de");
        expect(n1.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau"]);
        const n2: Name = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau");
        expect(n2.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        const n3: Name = n.remove(0);
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(n3.asString()).toBe("cs.fau.de");
    });
});

describe("Delimiter function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss#fau#\\#de", '#');
        expect(n.asDataString()).toBe("oss#fau#\\#de");
        console.log("test before")
        const n1: Name = n.insert(1, "cs");
        console.log("test after")
        expect(n.asDataString()).toBe("oss#fau#\\#de");
        expect(n.asString()).toBe("oss#fau##de");
        expect(n1.asDataString()).toBe("oss#cs#fau#\\#de");
        expect(n1.asString()).toBe("oss#cs#fau##de");
    });
});

describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions (delimiter = \"#\")", () => {
        let n: Name = new StringName("oss.cs.fau.de", '#');
        expect(n.getNoComponents()).toBe(1);
        expect(n.asString()).toBe("oss.cs.fau.de");
        const n1: Name = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(n1.asString()).toBe("oss.cs.fau.de#people");
    });

    it("test escape and delimiter boundary conditions (delimiter = \".\")", () => {
        let n: Name = new StringName("oss\\.cs\\.fau.de", '.');
        expect(n.getNoComponents()).toBe(2);
        expect(n.asString("#")).toBe("oss.cs.fau#de");
        const n1: Name = n.append("people");
        expect(n.asString("#")).toBe("oss.cs.fau#de");
        expect(n1.asString("#")).toBe("oss.cs.fau#de#people");
    });
});

describe("Custom: Extensive masking test", () => {
    it("test masking and unmasking with additional escape characters", () => {
        let n: Name = new StringName("oss\\\\.cs\\\\\\#fau\\\\#de", '#');
        expect(n.getNoComponents()).toBe(2);
        expect(n.asString("*")).toBe("oss\\.cs\\#fau\\*de");
        const n1: Name = n.append("people");
        expect(n.asString("*")).toBe("oss\\.cs\\#fau\\*de");
        expect(n.asDataString()).toBe("oss\\\\.cs\\\\\\#fau\\\\#de");
        expect(n1.asString("*")).toBe("oss\\.cs\\#fau\\*de*people");
        expect(n1.asDataString()).toBe("oss\\\\.cs\\\\\\#fau\\\\#de#people");
    });

    it("Custom: test escape character as delimiter", () => {
        let n: Name = new StringName("oss\\\\.cs\\.fau.de", '\\');
        expect(n.getNoComponents()).toBe(4);
        expect(n.asString("#")).toBe("oss##.cs#.fau.de");
        expect(n.asString(".")).toBe("oss...cs..fau.de");
        expect(n.asDataString()).toBe("oss\\\\.cs\\.fau.de");
        const n1: Name = n.append("people");
        expect(n.asString("#")).toBe("oss##.cs#.fau.de");
        expect(n1.asString("#")).toBe("oss##.cs#.fau.de#people");
    });
});

describe("Custom: Non default delimiter masking", () => {
    it("test handling of non default delimiters, masked and unmasked", () => {
        // Original name string = "oss.cs.fau.de"
        let n: Name = new StringName("oss.cs.fau\\#de", '#');
        expect(n.asString()).toBe("oss.cs.fau#de");
        const n1: Name = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau#de");
        expect(n1.asString()).toBe("oss.cs.fau#de#people");
    });

    it("test handling of non default delimiters, masked and unmasked and unmasked default delimiter", () => {
        // Original name string = "oss.cs.fau.de"
        let n: Name = new StringName("oss.cs.fau\\#de", '#');
        expect(n.asDataString()).toBe("oss.cs.fau\\#de");
        expect(n.asString()).toBe("oss.cs.fau#de");
        const n1: Name = n.append("people");
        expect(n.asString(".")).toBe("oss.cs.fau#de");
        expect(n1.asString(".")).toBe("oss.cs.fau#de.people");
    });
});