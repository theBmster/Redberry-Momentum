import { useModal } from "@/contexts/ModalProvider";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Logo from '@/assets/img/momentum.svg';

const Header = () => {
    const { openModal } = useModal();
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 select-none w-full h-[100px] py-7 px-32 flex justify-between items-center bg-white z-50">
            <div className="flex gap-1">
                <img 
                    src={Logo} 
                    alt="Logo" 
                    onClick={() => navigate('/')} 
                    className="h-[38px] w-[203px] cursor-pointer" // Set specific height and width
                />
            </div>
            <div className="flex gap-10 items-center">
                <Button text="თანამშრომლის შექმნა" solid={false} onClick={openModal} />
                <Button text="შექმენი ახალი დავალება" plus={true} onClick={() => navigate('/create')} />
            </div>
        </header>
    );
}

export default Header;