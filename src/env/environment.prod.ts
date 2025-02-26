export const environment = {
    production: true,
    apiUrl: (window as any).env?.API_BASE_URL || 'https://onrender.com/api'
};