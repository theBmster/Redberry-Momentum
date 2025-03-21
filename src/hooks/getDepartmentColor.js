export const getDepartmentColor = (id) => {
    switch (id) {
        case 1:
        case 2:
        case 3:
        case 5:
            return '#89B6FF';
            break;
        case 4:
            return '#FD9A6A';
            break;
        case 6:
            return '#FFD86D';
            break;
        case 7:
            return '#FF66A8';
            break;
        default:
            return '#89B6FF';
            break;
    }
}