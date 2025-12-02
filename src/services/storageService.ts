
/**
 * Mock implementation for Prototype
 * Converts file to Base64 to allow localStorage persistence.
 */
export async function uploadImage(file: File): Promise<string> {
    // 1. Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image.');
    }

    // 3. Convert to Base64 for persistence
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
