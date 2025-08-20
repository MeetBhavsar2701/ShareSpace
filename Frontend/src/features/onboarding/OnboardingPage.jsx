import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { GridMotionBackground } from "@/components/GridMotionBackground";
import { useChimes } from "@/useChimes";

// --- Create a dedicated, authenticated axios instance ---
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Form Steps Configuration (Complete) ---
const steps = [
  {
    title: "Core Lifestyle",
    description: "How you like to live.",
    fields: [
      { id: 'cleanliness', text: "How tidy do you keep your space?", type: 'radio', options: ["1 (Messy)", "2", "3 (Average)", "4", "5 (Spotless)"] },
      { id: 'sleep_schedule', text: "What's your typical sleep schedule?", type: 'radio', options: ["Early Bird", "Night Owl", "Flexible"] },
    ]
  },
  {
    title: "Social Habits",
    description: "How you interact with others.",
    fields: [
      { id: 'noise_level', text: "What's your ideal noise level at home?", type: 'radio', options: ["1 (Quiet)", "2", "3 (Moderate)", "4", "5 (Lively)"] },
      { id: 'social_level', text: "How do you see your relationship with a roommate?", type: 'radio', options: ["Keep to self", "Friendly but independent", "Very social / Friends"] },
      { id: 'guest_frequency', text: "How often do you have guests over?", type: 'radio', options: ["Rarely", "Occasionally", "Frequently"] },
      { id: 'smoking', text: "What is your smoking preference?", type: 'radio', options: ["Non-Smoker", "Smokes Outside", "Smokes Inside"] },
    ]
  },
  {
    title: "Practical Details",
    description: "Let's cover the essentials.",
    fields: [
      { id: 'has_pets', text: "Do you have any pets?", type: 'radio', options: ["Yes", "No"] },
      { id: 'gender_preference', text: "You're comfortable living with:", type: 'radio', options: ["Males", "Females", "No Preference"] },
      { id: 'city', text: "Which city are you looking in?", type: 'text', placeholder: "e.g., Metro City" },
      { id: 'budget', text: "What is your monthly budget (₹)?", type: 'number', placeholder: "e.g., 1200" },
    ]
  },
  {
      title: "Work & Study Life",
      description: "Tell us about your daily routine.",
      fields: [
          { id: 'work_schedule', text: "What's your schedule like?", type: 'select', options: ["9-to-5", "Shift Work", "Remote / WFH", "Student"] },
          { id: 'occupation', text: "What is your occupation or field of study?", type: 'select', options: ["Tech", "Healthcare", "Creative", "Retail", "Education", "Finance", "Other"] },
      ]
  },
  {
    title: "Personality Profile",
    description: "Just a few more questions to find your type.",
    fields: [
      { id: 'mbti_ie', text: "At a party, do you prefer to...", type: 'radio', options: ["Interact with many people (E)", "Talk to a few, one-on-one (I)"] },
      { id: 'mbti_sn', text: "Do you focus more on...", type: 'radio', options: ["The reality of how things are (S)", "The possibilities of how things could be (N)"] },
      { id: 'mbti_tf', text: "You make decisions based on...", type: 'radio', options: ["Logic and objective facts (T)", "Feelings and impact on others (F)"] },
      { id: 'mbti_jp', text: "Do you prefer to...", type: 'radio', options: ["Have a plan and stick to it (J)", "Keep your options open (P)"] },
    ]
  }
];

// Function to initialize the state with default values to prevent uncontrolled component warnings
const initializeAnswers = () => {
    const initialState = {};
    steps.forEach(step => {
        step.fields.forEach(field => {
            initialState[field.id] = field.type === 'radio' ? null : '';
        });
    });
    return initialState;
};

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState(initializeAnswers);
    const navigate = useNavigate();
    const chimes = useChimes();

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            toast.warning("Refreshing will lose your progress!", {
                description: "Please complete the quiz to save your preferences.",
            });
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const handleAnswer = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };
    
    const isStepComplete = () => {
        return steps[currentStep].fields.every(field => answers[field.id]);
    };

    const calculateMbtiType = () => {
        const ie = answers.mbti_ie?.includes("(I)") ? "I" : "E";
        const sn = answers.mbti_sn?.includes("(S)") ? "S" : "N";
        const tf = answers.mbti_tf?.includes("(T)") ? "T" : "F";
        const jp = answers.mbti_jp?.includes("(J)") ? "J" : "P";
        return `${ie}${sn}${tf}${jp}`;
    };

    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            const finalAnswers = {
                ...answers,
                mbti_type: calculateMbtiType(),
                cleanliness: parseInt(answers.cleanliness, 10),
                noise_level: parseInt(answers.noise_level, 10),
                has_pets: answers.has_pets === "Yes",
            };
            
            delete finalAnswers.mbti_ie;
            delete finalAnswers.mbti_sn;
            delete finalAnswers.mbti_tf;
            delete finalAnswers.mbti_jp;

            try {
                // Use the new, authenticated api instance
                await api.patch("/users/profile/update/", finalAnswers);
                
                chimes?.success();
                toast.success("Welcome to Sharespace!", { description: "Your profile is all set up." });
                navigate("/listings");

            } catch (err) {
                chimes?.error();
                if (err.response?.status === 401) {
                    toast.error("Your session has expired.", { description: "Please log in again." });
                    navigate("/login");
                } else {
                    toast.error("Failed to save profile. Please try again.");
                }
                console.error("Failed to update profile:", err.response ? err.response.data : err);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / (steps.length)) * 100;

    return (
        <GridMotionBackground>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full max-w-3xl px-4"
                >
                    <Card className="w-full bg-white/80 backdrop-blur-lg border-stone-200/50 shadow-2xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-stone-800">{currentStepData.title}</CardTitle>
                            <CardDescription className="text-stone-600 text-lg">{currentStepData.description}</CardDescription>
                            <Progress value={progress} className="mt-4" />
                        </CardHeader>
                        <CardContent className="min-h-[350px] max-h-[60vh] overflow-y-auto p-6 space-y-8">
                            {currentStepData.fields.map((field) => (
                                <div key={field.id} className="space-y-4">
                                    <Label className="text-xl font-semibold text-stone-700">{field.text}</Label>
                                    {field.type === 'radio' && (
                                        <RadioGroup onValueChange={(value) => handleAnswer(field.id, value)} value={answers[field.id]} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {field.options.map((option) => (
                                                <div key={option}>
                                                    <RadioGroupItem value={option} id={`${field.id}-${option}`} className="peer sr-only" />
                                                    <Label
                                                        htmlFor={`${field.id}-${option}`}
                                                        className="flex h-full items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-emerald-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer transition-colors"
                                                    >
                                                        {option}
                                                        <CheckCircle className={`w-6 h-6 text-emerald-500 transition-opacity ${answers[field.id] === option ? 'opacity-100' : 'opacity-0'}`} />
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    )}
                                    {field.type === 'text' && <Input placeholder={field.placeholder} onChange={(e) => handleAnswer(field.id, e.target.value)} />}
                                    {field.type === 'number' && <Input type="number" placeholder={field.placeholder} onChange={(e) => handleAnswer(field.id, e.target.value)} />}
                                    {field.type === 'select' && (
                                        <Select onValueChange={(value) => handleAnswer(field.id, value)}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent className="bg-background">
                                                {field.options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                        <div className="flex items-center justify-between p-6 border-t bg-stone-50/50 rounded-b-2xl">
                            <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button onClick={nextStep} disabled={!isStepComplete()} className="bg-emerald-500 hover:bg-emerald-600 text-lg px-6 py-3 rounded-xl">
                                {currentStep === steps.length - 1 ? "Finish & Find Matches" : "Next"}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </GridMotionBackground>
    );
}