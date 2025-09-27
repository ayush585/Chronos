export function buildManifest(plan){
  return {
    version: 1,
    chain: plan.chain,
    artifact: 'ConditionalRecurringIntent.sol',
    constructorArgs: {
      owner: process.env.DEPLOYER_ADDRESS||'',
      token: plan.tokenAddr,
      beneficiary: plan.beneficiary,
      amountWei: plan.amountWei,
      periodSeconds: plan.periodSeconds,
      oracle: plan.oracle,
      symbol: plan.symbolBytes32,
      thresholdX8: plan.thresholdX8
    },
    createdAt: new Date().toISOString()
  };
}
