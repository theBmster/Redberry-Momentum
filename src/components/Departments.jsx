import { getDepartmentColor } from '@/hooks/getDepartmentColor';
const Department = ({ department }) => {

    const shortenDepartmentName = (name) => {
        if (name.length <= 10) {
            return name;
        }
        return name.split(' ').map(word => word.substring(0, 2)).join('.');
    };

    return (
        <div className="flex items-center py-[5px] px-[10px] max-w-[90px] h-[26px] gap-2 rounded-[15px]"
            style={{ backgroundColor: getDepartmentColor(department.id) }}
            title={department.name}>
            <span className='font-firaGO font-normal text-xs text-white'>{shortenDepartmentName(department.name)}</span>
        </div>
    )
}

export default Department;