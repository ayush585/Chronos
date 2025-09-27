export function toBytes32(str) {
  // Convert string to bytes32 format (32 bytes, padded with zeros)
  const bytes = new TextEncoder().encode(str);
  const padded = new Uint8Array(32);
  padded.set(bytes.slice(0, 32));
  return '0x' + Array.from(padded).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function toX8(num) {
  // Convert number to 8-byte hex representation
  return '0x' + num.toString(16).padStart(16, '0');
}
