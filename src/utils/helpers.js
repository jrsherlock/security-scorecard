import { MATURITY_LEVELS, COLORS } from '../data/constants';

export const getMaturityLevel = (score) => {
    return MATURITY_LEVELS.find(m => score >= m.range[0] && score <= m.range[1]) || MATURITY_LEVELS[0];
};

export const getScoreColor = (score) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return '#84CC16';
    if (score >= 40) return COLORS.warning;
    if (score >= 20) return '#F97316';
    return COLORS.danger;
};
