import { motion } from "framer-motion";
import hourglassIcon from '@/assets/img/Hourglass.svg';

const Loader = () => {
    return (
        <div className="w-full flex items-center justify-center h-screen pb-40">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-firaGO text-xl text-gray-600 flex flex-col items-center gap-10"
            >
                <motion.img 
                    src={hourglassIcon} 
                    alt="Hourglass" 
                    className="w-32 h-32" 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <h1 className="font-fredokaOne text-2xl font-bold animate-pulse">მიმდინარეობს ჩატვირთვა</h1>
                <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-purple-600"
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </div>
    );
}

export default Loader;