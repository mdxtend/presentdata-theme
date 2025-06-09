import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Feedback: React.FC = () => {
    const [feedbackType, setFeedbackType] = useState<'yes' | 'no' | null>(null);

    const handleFeedback = (type: 'yes' | 'no') => {
        if (feedbackType) return;
        setFeedbackType(type);
    };

    const isYes = feedbackType === 'yes';
    const isNo = feedbackType === 'no';

    return (
        <div className="px-6 flex flex-col gap-3 pb-5">
            <div className="font-mono text-xs uppercase text-foreground-highlight tracking-wide">Is this helpful?</div>
            <div className="flex items-center gap-3">
                <div className="flex gap-2 items-center">
                    {!isNo && (
                        <button
                            type="button"
                            onClick={() => handleFeedback('yes')}
                            className={`relative justify-center cursor-pointer items-center text-center font-regular ease-out duration-200 border transition-all px-2 py-1 ${isYes ? 'bg-success text-background border-success' : 'bg-transparent hover:text-success hover:border-success text-foreground-muted'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            // strokeLinecap="round"
                            // strokeLinejoin="round"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span className="sr-only">Yes</span>
                        </button>
                    )}
                    {!isYes && (
                        <button
                            type="button"
                            onClick={() => handleFeedback('no')}
                            className={`relative justify-center cursor-pointer items-center text-center font-regular ease-out duration-200 border transition-all px-2 py-1 ${isNo ? 'bg-warning text-background border-warning' : 'bg-transparent hover:text-warning hover:border-warning text-foreground-muted'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                            // strokeLinecap="round"
                            // strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                            <span className="sr-only">No</span>
                        </button>
                    )}
                </div>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={feedbackType ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-1 text-xs font-sans tracking-wide text-left"
                >
                    {feedbackType && <span className="text-foreground">Thanks for your feedback!</span>}
                </motion.div>
            </div>
        </div>
    );
};

export default Feedback;
