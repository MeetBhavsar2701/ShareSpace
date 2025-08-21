import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Moon, Sun, Users, Home, Search, BedDouble, Shield, BrainCircuit } from "lucide-react";
import { GridMotionBackground } from "@/components/GridMotionBackground";
import { useChimes } from "@/hooks/useChimes";

const steps = [
  { 
    id: 'lifestyle', title: "Core Lifestyle", icon: Home, fields: [
      { id: 'cleanliness', text: "How tidy do you keep your space?", type: 'scale', options: ["Messy", "Casual", "Average", "Tidy", "Spotless"] },
      { id: 'sleep_schedule', text: "What's your typical sleep schedule?", type: 'radio', options: [
          { value: "Early Bird", icon: Sun }, 
          { value: "Night Owl", icon: Moon }, 
          { value: "Flexible", icon: BedDouble }
      ]},
    ]
  },
  { 
    id: 'social', title: "Social Habits", icon: Users, fields: [
      { id: 'social_level', text: "How do you see your relationship with a roommate?", type: 'radio', options: [
          { value: "Keep to self" }, 
          { value: "Friendly but independent" }, 
          { value: "Very social / Friends" }
      ]},
      { id: 'guest_frequency', text: "How often do you have guests over?", type: 'radio', options: [
          { value: "Rarely" }, { value: "Occasionally" }, { value: "Frequently" }
      ]},
    ]
  },
  {
    id: 'practical', title: "Practical Details", icon: Search, fields: [
      { id: 'has_pets', text: "Do you have any pets?", type: 'radio', options: [{ value: "Yes" }, { value: "No" }] },
      { id: 'gender_preference', text: "You're comfortable living with:", type: 'radio', options: [{ value: "Males" }, { value: "Females" }, { value: "No Preference" }] },
      { id: 'budget', text: "What is your monthly budget (₹)?", type: 'number', placeholder: "e.g., 12000" },
    ]
  },
  {
    id: 'personality', title: "Personality Profile", icon: BrainCircuit, fields: [
      { id: 'mbti_ie', text: "At a party, you are more likely to...", type: 'radio', options: [{ value: "Interact with many people (E)" }, { value: "Talk to a few, one-on-one (I)" }] },
      { id: 'mbti_sn', text: "Do you focus more on...", type: 'radio', options: [{ value: "The reality of how things are (S)" }, { value: "The possibilities of how things could be (N)" }] },
      { id: 'mbti_tf', text: "You make decisions based on...", type: 'radio', options: [{ value: "Logic and objective facts (T)" }, { value: "Feelings and impact on others (F)" }] },
      { id: 'mbti_jp', text: "Do you prefer to...", type: 'radio', options: [{ value: "Have a plan and stick to it (J)" }, { value: "Keep your options open (P)" }] },
    ]
  }
];

const initializeAnswers = () => {
    const initialState = {};
    steps.forEach(step => {
        step.fields.forEach(field => {
            initialState[field.id] = field.type === 'scale' ? null : (field.type === 'radio' ? null : '');
        });
    });
    return initialState;
};

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState(initializeAnswers);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const chimes = useChimes();

    const handleAnswer = (questionId, value) => {
        chimes?.tap();
        setAnswers({ ...answers, [questionId]: value });
    };
    
    const isStepComplete = () => {
        return steps[currentStep].fields.every(field => answers[field.id] !== null && answers[field.id] !== '');
    };

    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsSubmitting(true);
            const finalAnswers = { ...answers };
            
            // --- FIX: The logic here is updated to handle strings correctly ---
            finalAnswers.mbti_type = `${answers.mbti_ie?.includes("(I)") ? "I" : "E"}${answers.mbti_sn?.includes("(S)") ? "S" : "N"}${answers.mbti_tf?.includes("(T)") ? "T" : "F"}${answers.mbti_jp?.includes("(J)") ? "J" : "P"}`;
            finalAnswers.cleanliness = answers.cleanliness ? answers.cleanliness.index + 1 : null;
            finalAnswers.has_pets = answers.has_pets === "Yes"; // <-- FIX: Changed from answers.has_pets?.value
            
            ['mbti_ie', 'mbti_sn', 'mbti_tf', 'mbti_jp'].forEach(k => delete finalAnswers[k]);

            try {
                await api.patch("/users/profile/update/", finalAnswers);
                chimes?.success();
                setTimeout(() => {
                    toast.success("Welcome to Sharespace!", { description: "Your profile is all set up." });
                    navigate("/listings");
                }, 2000);
            } catch (err) {
                setIsSubmitting(false);
                chimes?.error();
                toast.error("Failed to save profile. Please try again.");
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

    return (
        <GridMotionBackground>
            <div className="w-full min-h-screen lg:grid lg:grid-cols-12 lg:gap-12 lg:p-12">
                <aside className="hidden lg:col-span-3 lg:flex flex-col justify-center space-y-6">
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        return (
                            <div key={step.id} className="flex items-center gap-4 transition-all">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-emerald-500 bg-emerald-500 text-white' : isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 bg-white'}`}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${isActive ? 'text-stone-800' : isCompleted ? 'text-stone-800' : 'text-gray-400'}`}>{step.title}</h3>
                                    <p className={`text-sm ${isActive ? 'text-stone-600' : 'text-gray-400'}`}>{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </aside>

                <main className="lg:col-span-9 flex items-center justify-center w-full px-4">
                    <AnimatePresence mode="wait">
                        {isSubmitting ? (
                            <CompletionAnimation />
                        ) : (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="w-full max-w-4xl"
                            >
                                <Card className="w-full bg-white/80 backdrop-blur-lg border-stone-200/50 shadow-2xl rounded-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-3xl font-bold text-stone-800">{currentStepData.title}</CardTitle>
                                        <CardDescription className="text-stone-600 text-lg">{currentStepData.description}</CardDescription>
                                        <Progress value={progress} className="mt-4 [&>*]:bg-emerald-500" />
                                    </CardHeader>
                                    <CardContent className="min-h-[350px] max-h-[60vh] overflow-y-auto p-6 space-y-8">
                                        {currentStepData.fields.map((field) => (
                                            <div key={field.id} className="space-y-4 animate-in fade-in duration-500">
                                                <Label className="text-xl font-semibold text-stone-700">{field.text}</Label>
                                                
                                                {field.type === 'scale' && (
                                                    <RadioGroup onValueChange={(value) => handleAnswer(field.id, { value, index: field.options.indexOf(value) })} value={answers[field.id]?.value} className="grid grid-cols-5 gap-2">
                                                        {field.options.map((option, index) => (
                                                            <div key={option}>
                                                                <RadioGroupItem value={option} id={`${field.id}-${option}`} className="peer sr-only" />
                                                                <Label htmlFor={`${field.id}-${option}`} className="flex flex-col items-center justify-center text-center rounded-lg border-2 border-muted bg-white p-4 h-24 hover:bg-emerald-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-colors">
                                                                    <span className="font-bold text-lg">{index + 1}</span>
                                                                    <span className="text-sm text-stone-500">{option}</span>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )}

                                                {field.type === 'radio' && (
                                                    // --- FIX: Now passes the string value directly, not an object ---
                                                    <RadioGroup onValueChange={(value) => handleAnswer(field.id, value)} value={answers[field.id]} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {field.options.map((option) => (
                                                            <div key={option.value}>
                                                                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} className="peer sr-only" />
                                                                <Label htmlFor={`${field.id}-${option.value}`} className="flex h-full items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-emerald-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-colors">
                                                                    <span className="flex items-center gap-3">{option.icon && <option.icon className="w-5 h-5 text-stone-600" />} {option.value}</span>
                                                                    <CheckCircle className={`w-6 h-6 text-emerald-500 transition-opacity ${answers[field.id] === option.value ? 'opacity-100' : 'opacity-0'}`} />
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )}

                                                {field.type === 'number' && <Input type="number" placeholder={field.placeholder} value={answers[field.id]} onChange={(e) => handleAnswer(field.id, e.target.value)} className="h-12 text-lg" />}
                                            </div>
                                        ))}
                                    </CardContent>
                                    <div className="flex items-center justify-between p-6 border-t bg-stone-50/50 rounded-b-2xl">
                                        <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
                                        <Button onClick={nextStep} disabled={!isStepComplete()} className="bg-emerald-500 hover:bg-emerald-600 text-lg px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-300 transition-shadow">
                                            {currentStep === steps.length - 1 ? "Finish & Find Matches" : "Next"}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </GridMotionBackground>
    );
}

const CompletionAnimation = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center text-center p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl"
        >
            <div className="relative w-24 h-24 mb-6">
                <motion.div 
                    className="absolute inset-0 border-4 border-emerald-200 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 200 }} 
                    className="w-full h-full flex items-center justify-center bg-emerald-500 rounded-full"
                >
                    <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-stone-800">All Done!</h2>
            <p className="text-lg text-stone-600 mt-2">We're finding the best matches for you...</p>
        </motion.div>
    );
};