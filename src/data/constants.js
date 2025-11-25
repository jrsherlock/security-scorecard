export const COLORS = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    dark: '#1F2937',
    light: '#F3F4F6'
};

export const DOMAIN_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];
export const GRADIENT_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

export const INDUSTRY_BENCHMARKS = {
    healthcare: { name: 'Healthcare', avg: 62, top: 85, bottom: 45 },
    financial: { name: 'Financial Services', avg: 71, top: 92, bottom: 55 },
    manufacturing: { name: 'Manufacturing', avg: 54, top: 78, bottom: 38 },
    retail: { name: 'Retail', avg: 48, top: 72, bottom: 32 },
    technology: { name: 'Technology', avg: 68, top: 89, bottom: 52 },
    government: { name: 'Government', avg: 58, top: 80, bottom: 42 }
};

export const MATURITY_LEVELS = [
    { level: 1, name: 'Initial', range: [0, 20], color: '#EF4444', description: 'Ad-hoc, reactive' },
    { level: 2, name: 'Developing', range: [21, 40], color: '#F97316', description: 'Some processes defined' },
    { level: 3, name: 'Defined', range: [41, 60], color: '#F59E0B', description: 'Standardized practices' },
    { level: 4, name: 'Managed', range: [61, 80], color: '#84CC16', description: 'Measured & controlled' },
    { level: 5, name: 'Optimizing', range: [81, 100], color: '#10B981', description: 'Continuous improvement' }
];
