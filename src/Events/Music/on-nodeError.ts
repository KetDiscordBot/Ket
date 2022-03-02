import { Node } from "erela.js";
import KetClient from "../../Main";

module.exports = class nodeErrorEvent {
    ket: KetClient;
    constructor(ket: KetClient) {
        this.ket = ket;
    }
    async on(node: Node, error: Error) {
        console.log('ERELA', `Node "${node.options.identifier}" encountered an error: ${error.message}.`, 41)
        return;
    }
}