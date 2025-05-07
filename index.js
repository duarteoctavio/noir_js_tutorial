import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from "./circuit/nonparametrical_tests.json";

const show = (id, content) => {
    const container = document.getElementById(id);
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};

const dataset = [418,-430,-673,1008,-1180,1227,1331,-1598,1964,-2054,2870,-3040,3275,3292,-4092,-4129,-4212,-4319,4423,-4723,4748,-4789,5383,-5968,-6018,-6231,6419,-6463,6502,6653,6683,-6691]
;
let hash = "0x10c5ecf6c58460eb00eba98b21ef57d36671753cc77d111bfedb8f3dbfb7f4ff";

document.getElementById("submit").addEventListener("click", async () => {
    try {
        const noir = new Noir(circuit);
        const backend = new UltraHonkBackend(circuit.bytecode);


        show("logs", "Generating witness... ⏳");
        const { witness } = await noir.execute( {
            statistic_threshold: 4227,
            dataset: dataset,
            expected_root: hash
        } );
        console.log(witness);
        show("logs", "Generated witness... ✅");
        show("logs", "Generating proof... ⏳");
        const proofData = await backend.generateProof(witness,  {keccak: true});
        show("logs", "Generated proof... ✅");
        show("results", proofData);
        show('logs', 'Verifying proof... ⌛');
        const isValid = await backend.verifyProof(proofData, { keccak: true });
        console.log("validation");
        console.log(isValid);
        show("logs", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
    } catch (e) {
        show("logs", "Oh 💔");
        show("logs", e);
        throw e;
    }
});
