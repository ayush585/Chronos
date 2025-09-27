import { parseIntent } from "../src/lib/parser/parse.js";

const cases = [
    "Send 10 PYUSD to alice.eth every Friday until ETH > 3000",
    "Send 1,000.50 PYUSD to 0x1111111111111111111111111111111111111111 every weekly until ETH > 2,500.25",
    "Send 0.5 PYUSD to vitalik.eth every day until ETH > 1800"
];

for (const c of cases) {
    try {
        const out = parseIntent(c);
        console.log("OK:", c);
        console.log(JSON.stringify(out, null, 2));
    } catch (e) {
        console.error("FAIL:", c);
        console.error(e.message);
        process.exitCode = 1;
    }
}