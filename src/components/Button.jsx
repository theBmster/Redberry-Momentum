import addIcon from '@/assets/img/add.svg';

const Button = ({ text, solid = true, plus = false, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className={`rounded-md ${solid ? 'bg-purple hover:bg-purple-light' : 'border border-purple hover:border-purple-light'} cursor-pointer flex items-center justify-center py-[10px] px-5 gap-1 transition-all duration-300 delay-75`}
        >
            {plus && <img src={addIcon} alt="Plus" />}
            <p className={`text-base font-firaGo font-normal ${solid ? 'text-white' : 'text-ourBlack'}`}>{text}</p>
        </div>
    );
};

export default Button;