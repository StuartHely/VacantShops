class SearchService {
    constructor() {
        this.apiBase = process.env.API_URL || 'http://localhost:3000/api';
    }

    async performSearch(query) {
        try {
            const response = await fetch(`${this.apiBase}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }

    async getPropertyDetails(propertyId) {
        try {
            const response = await fetch(`${this.apiBase}/properties/${propertyId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch property details');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Property fetch error:', error);
            throw error;
        }
    }

    async submitInquiry(inquiryData) {
        try {
            const response = await fetch(`${this.apiBase}/inquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inquiryData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit inquiry');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Inquiry submission error:', error);
            throw error;
        }
    }
}

export default new SearchService();