// src/utils.ts

type JsonResponse = Record<string, any>;

// Check if running in Tauri environment
const isTauri = !!(window as any).__TAURI__;

export async function fetchJson(filePath: string): Promise<JsonResponse | null> {
    if (isTauri) {
        // If in Tauri environment, call backend command
        const { invoke } = (window as any).__TAURI__.tauri;
        try {
            const response: string = await invoke('get_json_from_backend', { filePath });
            return JSON.parse(response);
        } catch (error) {
            console.error('Error fetching JSON from backend:', error);
            return null;
        }
    } else {
        // If in web environment, use fetch to get JSON from server
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching JSON from server:', error);
            return null;
        }
    }
}

// Example usage
fetchJson('/path/to/your/file.json').then(data => {
    console.log('JSON data:', data);
});
