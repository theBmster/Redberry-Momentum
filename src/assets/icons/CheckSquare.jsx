import { motion, AnimatePresence } from "framer-motion";

const CheckSquare = ({ isChecked }) => (
    <motion.svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={false}
        animate={{ scale: isChecked ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.2 }}
    >
        <rect
            x="0.75"
            y="0.75"
            width="20.5"
            height="20.5"
            rx="5.25"
            stroke={isChecked ? '#8338EC' : '#0D0F10'}
            strokeWidth="1.5"
        />
        <AnimatePresence>
            {isChecked && (
                <motion.path
                    d="M16.3333 7.33337L8.99996 14.6667L5.66663 11.3334"
                    stroke="#8338EC"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </AnimatePresence>
    </motion.svg>
);

export default CheckSquare;