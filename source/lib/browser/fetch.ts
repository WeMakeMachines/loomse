export async function getTextFile(filePath: string) {
	const response = await fetch(filePath);

	return response.text();
}
