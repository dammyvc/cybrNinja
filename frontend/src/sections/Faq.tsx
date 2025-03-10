import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export const Faq = () => {
    return (
        <section className='bg-white dark:bg-dark flex justify-center flex-col pb-10'>
            <div className="container">
                <h2 className="container text-4xl font-semibold text-center leading-tight text-black dark:text-white pt-10">
                    FAQs

                </h2>
            </div>
            <div className='container pt-10'>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">What is CybrNinja, and who is it for?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        CybrNinja is a gamified cybersecurity training platform that helps users improve their phishing detection skills through AI-powered quizzes, real-time coaching, and adaptive challenges. It’s designed for beginners, professionals, and anyone looking to boost their cybersecurity awareness in a fun and engaging way.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span">How does the AI-powered phishing quiz work?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        The AI generates realistic phishing scenarios and adjusts the difficulty based on your past performance. If you miss a question, the system provides real-time coaching to help you learn and improve. The more you train, the smarter and more challenging the quizzes become.
                    </AccordionDetails>
                </Accordion>

                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography component="span">Is CybrNinja free to use?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Yes! CybrNinja offers a free version with essential features. We may introduce premium plans with additional training modules, advanced analytics, and personalized coaching in the future.
                    </AccordionDetails>

                </Accordion>

                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">Can I track my progress and compete with others?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Absolutely! CybrNinja includes leaderboards, experience points (XP), and challenge levels to keep you motivated. You can track your improvement over time and see how you rank against others.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span">Do I need cybersecurity experience to use CybrNinja?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Not at all! CybrNinja is designed for all skill levels. Whether you're a complete beginner or an experienced professional, the platform adapts to your knowledge and helps you improve at your own pace.
                    </AccordionDetails>
                </Accordion>

                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography component="span">How is my data used and stored?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        We take data privacy seriously. Your information is stored securely and is only used to personalize your learning experience. We do not sell or share your data with third parties. You can review our privacy policy for more details.
                    </AccordionDetails>

                </Accordion>

                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography component="span">Is CybrNinja safe and secure to use?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        Yes! CybrNinja follows strict security protocols to ensure a safe experience for all users. We use encryption, secure authentication methods, and regular security updates to protect your data and keep the platform secure.
                    </AccordionDetails>

                </Accordion>
            </div>
        </section>
    );
}