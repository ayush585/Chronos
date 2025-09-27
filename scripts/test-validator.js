import { validateAndPlan } from "../src/lib/validator/validate.js";

const intents = [
  {
    action: "send",
    asset: "PYUSD",
    amount: "10",
    to: "0x1111111111111111111111111111111111111111", // 0x address → no ENS needed
    schedule: "weekly",
    condition: { price_gt: true, symbol: "ETH", threshold: "3000" }
  }
];

(async () => {
  for (const it of intents) {
    try {
      const plan = await validateAndPlan(it);
      console.log("PLAN OK:", JSON.stringify(plan, null, 2));
    } catch (e) {
      console.error("PLAN FAIL:", e.message);
      process.exitCode = 1;
    }
  }
})();
