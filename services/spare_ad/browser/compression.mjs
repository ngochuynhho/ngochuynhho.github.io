/* Accept stored gzip files and hosts/CDNs that transparently decompress them. */
export async function assetBuffer(response) {
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return buffer;
  if (!globalThis.DecompressionStream) throw Error("This browser cannot decompress the application assets. Please use a current browser.");
  return new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
}
