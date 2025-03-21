import DropdownIcon from "@/assets/icons/DropdownIcon";
import { useAPI } from "@/contexts/APIProvider";
import MultiSelectDropdown from "./MultiSelectDropdown";
import SingleSelectDropdown from "./SingleSelectDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { useFilter } from "@/contexts/FilterProvider";

const FilterBar = () => {
    const { employees, priorities, departments } = useAPI();
    const {
        selectedFilters,
        selectedDropdown,
        hasFilters,
        toggleDropdown,
        updateDepartmentFilters,
        updatePriorityFilters,
        updateEmployeeFilter,
        removeFilter,
        removeEmployeeFilter,
        clearAllFilters
    } = useFilter();

    return (
        <div className="font-firaGO z-50 mb-6">
            <div className="border-[1px] border-[#DEE2E6] rounded-[10px] w-[688px] h-[44px]">
                <div className="flex justify-between items-center h-full">
                    <div
                        onClick={() => toggleDropdown('department')}
                        className={`w-[200px] py-2.5 px-[18px] flex items-center justify-center gap-2 select-none cursor-pointer ${selectedDropdown === 'department' ? 'text-purple' : 'text-ourBlack-gray'}`}
                    >
                        <span className="text-base">დეპარტამენტი</span>
                        <DropdownIcon isOpen={selectedDropdown === 'department'} color={selectedDropdown === 'department' ? '#8338EC' : '#0D0F10'} />
                    </div>
                    <div
                        onClick={() => toggleDropdown('priority')}
                        className={`w-[200px] py-2.5 px-[18px] flex items-center justify-center gap-2 select-none cursor-pointer ${selectedDropdown === 'priority' ? 'text-purple' : 'text-ourBlack-gray'}`}
                    >
                        <span className="text-base">პრიორიტეტი</span>
                        <DropdownIcon isOpen={selectedDropdown === 'priority'} color={selectedDropdown === 'priority' ? '#8338EC' : '#0D0F10'} />
                    </div>
                    <div
                        onClick={() => toggleDropdown('employee')}
                        className={`w-[200px] py-2.5 px-[18px] flex items-center justify-center gap-2 select-none cursor-pointer ${selectedDropdown === 'employee' ? 'text-purple' : 'text-ourBlack-gray'}`}
                    >
                        <span className="text-base">თანამშრომელი</span>
                        <DropdownIcon isOpen={selectedDropdown === 'employee'} color={selectedDropdown === 'employee' ? '#8338EC' : '#0D0F10'} />
                    </div>
                </div>
                <MultiSelectDropdown
                    options={departments}
                    isOpen={selectedDropdown === 'department'}
                    selectedOptions={selectedFilters.departments}
                    onClose={() => toggleDropdown('')}
                    onSelect={(options) => updateDepartmentFilters(options)}
                />
                <MultiSelectDropdown
                    options={priorities}
                    isOpen={selectedDropdown === 'priority'}
                    selectedOptions={selectedFilters.priorities}
                    onClose={() => toggleDropdown('')}
                    onSelect={(options) => updatePriorityFilters(options)}
                />
                <SingleSelectDropdown
                    options={employees}
                    selectedOption={selectedFilters.employee}
                    isOpen={selectedDropdown === 'employee'}
                    onClose={() => toggleDropdown('')}
                    onSelect={(option) => updateEmployeeFilter(option)}
                />
            </div>
            <div className="h-[80px] w-[90%] flex items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center mt-4">
                    <AnimatePresence>
                        {selectedFilters.departments.map(department => (
                            <motion.div
                                key={`dept-${department.id}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1 select-none rounded-[43px] py-1.5 text-ourBlack-light px-2.5 border-[1px] border-[#CED4DA] text-sm font-normal"
                            >
                                <span className="text-sm">{department.name.split(' ')[0]}</span>
                                <button
                                    onClick={() => removeFilter('departments', department.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Remove filter"
                                >
                                    ×
                                </button>
                            </motion.div>
                        ))}

                        {selectedFilters.priorities.map(priority => (
                            <motion.div
                                key={`priority-${priority.id}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1 select-none rounded-[43px] py-1.5 text-ourBlack-light px-2.5 border-[1px] border-[#CED4DA] text-sm font-normal"
                            >
                                <span className="text-sm">{priority.name}</span>
                                <button
                                    onClick={() => removeFilter('priorities', priority.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Remove filter"
                                >
                                    ×
                                </button>
                            </motion.div>
                        ))}

                        {selectedFilters.employee && (
                            <motion.div
                                key="employee-filter"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1 select-none rounded-[43px] py-1.5 text-ourBlack-light px-2.5 border-[1px] border-[#CED4DA] text-sm font-normal"
                            >
                                <span className="text-sm">{selectedFilters.employee.name + ' ' + selectedFilters.employee.surname}</span>
                                <button
                                    onClick={removeEmployeeFilter}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Remove filter"
                                >
                                    ×
                                </button>
                            </motion.div>
                        )}

                        {hasFilters && (
                            <motion.span
                                key="clear-filters"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm select-none text-ourBlack-light font-normal cursor-pointer"
                                onClick={clearAllFilters}
                            >
                                გასუფთავება
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;