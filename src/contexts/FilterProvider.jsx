import { createContext, useContext, useEffect, useState } from 'react';
import { useAPI } from './APIProvider';

const FilterContext = createContext();

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
}

export const FilterProvider = ({ children }) => {
    const { tasks } = useAPI();
    const [selectedFilters, setSelectedFilters] = useState({
        departments: [],
        priorities: [],
        employee: null
    });
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedDropdown, setSelectedDropdown] = useState('');

    useEffect(() => {
        if (!hasFilters) {
            setFilteredTasks(tasks);
            return;
        } else {
            let filtered = tasks.filter(task => {
                const employeeMatch = selectedFilters.employee === null ||
                    selectedFilters.employee.id === task.employee.id
                const priorityMatch = selectedFilters.priorities.length === 0 ||
                    selectedFilters.priorities.some(priority => priority.id == task.priority.id);
                const departmentMatch = selectedFilters.departments.length === 0 ||
                    selectedFilters.departments.some(department => department.id == task.department.id)
                return employeeMatch && priorityMatch && departmentMatch
            })
            setFilteredTasks(filtered);
            return;
        }

    }, [selectedFilters, tasks])
    const toggleDropdown = dropdown => {
        if (selectedDropdown === dropdown) {
            setSelectedDropdown('');
        }
        else {
            setSelectedDropdown(dropdown);
        }
    }

    const updateDepartmentFilters = departments => {
        setSelectedFilters({
            ...selectedFilters,
            departments
        })
    }
    const updatePriorityFilters = priorities => {
        setSelectedFilters({
            ...selectedFilters,
            priorities
        })
    }
    const updateEmployeeFilter = employee => {
        setSelectedFilters({
            ...selectedFilters,
            employee
        })
    }

    const removeFilter = (filterType, filterId) => {
        setSelectedFilters({
            ...selectedFilters,
            [filterType]: selectedFilters[filterType].filter(item => item.id !== filterId)
        })
    }

    const clearAllFilters = () => {
        setSelectedFilters({
            departments: [],
            priorities: [],
            employee: null
        })
    }

    const hasFilters = selectedFilters.departments.length > 0 ||
        selectedFilters.priorities.length > 0 ||
        selectedFilters.employee !== null;

    const value = {
        filteredTasks,
        selectedFilters,
        selectedDropdown,
        hasFilters,

        toggleDropdown,
        updateDepartmentFilters,
        updatePriorityFilters,
        updateEmployeeFilter,
        removeFilter,
        clearAllFilters,
    }

    return (
        <FilterContext value={value} >
            {children}
        </FilterContext>
    )

}

export default FilterProvider;