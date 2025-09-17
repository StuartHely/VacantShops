class NLPService {
    static extractEntities(query) {
        const entities = {
            location: null,
            businessType: null,
            budget: null,
            timing: null,
            size: null,
            propertyType: null
        };

        // Location extraction
        const australianCities = ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'hobart', 'darwin', 'canberra'];
        const suburbs = ['cbd', 'central', 'north', 'south', 'east', 'west'];
        
        const queryLower = query.toLowerCase();
        
        // Extract location
        australianCities.forEach(city => {
            if (queryLower.includes(city)) {
                entities.location = city;
            }
        });

        // Extract business type
        const businessTypes = {
            'coffee': 'food-beverage',
            'cafe': 'food-beverage',
            'restaurant': 'food-beverage',
            'food': 'food-beverage',
            'fashion': 'fashion',
            'clothing': 'fashion',
            'boutique': 'fashion',
            'retail': 'retail',
            'shop': 'retail',
            'store': 'retail'
        };

        Object.keys(businessTypes).forEach(keyword => {
            if (queryLower.includes(keyword)) {
                entities.businessType = businessTypes[keyword];
            }
        });

        // Extract budget
        const budgetMatch = query.match(/\$(\d+(?:,\d+)*)/);
        if (budgetMatch) {
            entities.budget = parseInt(budgetMatch[1].replace(',', ''));
        }

        // Extract timing
        if (queryLower.includes('next month') || queryLower.includes('soon')) {
            entities.timing = 'urgent';
        } else if (queryLower.includes('now') || queryLower.includes('immediately')) {
            entities.timing = 'immediate';
        }

        // Extract size
        const sizeMatch = query.match(/(\d+)\s*sqm/i);
        if (sizeMatch) {
            entities.size = parseInt(sizeMatch[1]);
        }

        return entities;
    }

    static generateSearchQuery(entities) {
        let sqlConditions = [];
        let params = [];
        let paramIndex = 1;

        if (entities.location) {
            sqlConditions.push(`(LOWER(suburb) LIKE $${paramIndex} OR LOWER(shopping_centre_name) LIKE $${paramIndex})`);
            params.push(`%${entities.location}%`);
            paramIndex++;
        }

        if (entities.businessType) {
            sqlConditions.push(`retail_categories ? $${paramIndex}`);
            params.push(entities.businessType);
            paramIndex++;
        }

        if (entities.budget) {
            sqlConditions.push(`minimum_rent <= $${paramIndex}`);
            params.push(entities.budget);
            paramIndex++;
        }

        if (entities.size) {
            sqlConditions.push(`size_sqm >= $${paramIndex}`);
            params.push(entities.size * 0.8); // Allow 20% variance
            paramIndex++;
        }

        return {
            conditions: sqlConditions.join(' AND '),
            params: params
        };
    }
}

module.exports = NLPService;