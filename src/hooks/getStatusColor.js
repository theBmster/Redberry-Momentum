export const getStatusColor = (status) => {
    switch (status.id) {
        case 1:
            return '#F7BC30';
        case 2:
            return '#FB5607';
        case 3:
            return '#FF006E';
        case 4:
            return '#3A86FF';
        default:
            return '#F7BC30';
    }
};