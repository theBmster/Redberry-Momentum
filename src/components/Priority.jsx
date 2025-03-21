const Priority = ({ priority }) => {
    // Define a list of colors to be used in a fixed order: yellow, orange, pink, blue
    const colorMap = ['#FFEB3B', '#FF9800', '#E91E63', '#2196F3'];  // yellow, orange, pink, blue

    // Make sure priorityColor is selected from the colorMap in the correct order
    const colorIndex = priority.id % colorMap.length; // Modulo ensures it stays within bounds of colorMap
    const selectedColor = colorMap[colorIndex];

    return (
        <div className="flex items-center h-[26px] rounded-[4px] p-1 gap-1 border-[1px]" style={{ borderColor: selectedColor, color: selectedColor }}>
            <img src={priority.icon} alt={priority.name} />
            <span className="font-firaGO font-medium text-xs" style={{ color: selectedColor }}>
                {priority.name}
            </span>
        </div>
    );
};

export default Priority;