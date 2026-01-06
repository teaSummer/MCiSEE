/**
 * fetch data from endpoint
 * @param filename file name
 * @param type data type
 * @param headers request headers
 * @param raw return raw text or not
 * @returns data content
 */
export async function fetchData(filename: ListedDataFiles | string, type?: DataType, headers?: HeadersInit, raw?: boolean) {
	type = type || 'data';
	const url = `${import.meta.env.VITE_DATA_ENDPOINT}/${type}/${filename}`;
	const res = await fetch(url, { headers });
	return raw? await res.text(): await res.json();
}
