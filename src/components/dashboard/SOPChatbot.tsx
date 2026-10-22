import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, FileText, Upload, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'options' | 'upload';
  content: string;
  options?: string[];
  uploadType?: string;
  timestamp: Date;
}

interface SOPStep {
  id: string;
  question: string;
  options?: string[];
  requiresUpload?: boolean;
  uploadType?: string;
  nextStep?: (answer: string) => string;
}

const sopFlows = {
  mutualFunds: [
    {
      id: 'mf-1',
      question: 'What type of mutual fund are you processing?',
      options: ['Equity Fund', 'Debt Fund', 'Hybrid Fund', 'Index Fund'],
      nextStep: () => 'mf-2'
    },
    {
      id: 'mf-2',
      question: 'What is the investment amount?',
      nextStep: () => 'mf-3'
    },
    {
      id: 'mf-3',
      question: 'Please upload the client\'s KYC documents',
      requiresUpload: true,
      uploadType: 'KYC Documents (PAN, Aadhaar, Bank Statement)',
      nextStep: () => 'mf-4'
    },
    {
      id: 'mf-4',
      question: 'Upload the investment application form',
      requiresUpload: true,
      uploadType: 'Application Form',
      nextStep: () => 'mf-complete'
    },
    {
      id: 'mf-complete',
      question: '✅ Mutual Fund application completed! The documents will be processed within 24-48 hours.',
      options: ['Start New Process', 'Exit']
    }
  ],
  loans: [
    {
      id: 'loan-1',
      question: 'Which type of loan is the client applying for?',
      options: ['Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Education Loan'],
      nextStep: () => 'loan-2'
    },
    {
      id: 'loan-2',
      question: 'What is the loan amount required?',
      nextStep: () => 'loan-3'
    },
    {
      id: 'loan-3',
      question: 'Which bank would you like to apply with?',
      options: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Other'],
      nextStep: () => 'loan-4'
    },
    {
      id: 'loan-4',
      question: 'Upload client\'s identity proof',
      requiresUpload: true,
      uploadType: 'Identity Proof (PAN Card, Aadhaar)',
      nextStep: () => 'loan-5'
    },
    {
      id: 'loan-5',
      question: 'Upload income proof documents',
      requiresUpload: true,
      uploadType: 'Income Proof (Salary Slips, ITR, Bank Statements)',
      nextStep: () => 'loan-6'
    },
    {
      id: 'loan-6',
      question: 'Upload address proof',
      requiresUpload: true,
      uploadType: 'Address Proof (Utility Bill, Rent Agreement)',
      nextStep: () => 'loan-7'
    },
    {
      id: 'loan-7',
      question: 'Upload the loan application form',
      requiresUpload: true,
      uploadType: 'Loan Application Form',
      nextStep: () => 'loan-complete'
    },
    {
      id: 'loan-complete',
      question: '✅ Loan application submitted successfully! The bank will review within 3-5 business days.',
      options: ['Start New Process', 'Exit']
    }
  ],
  bankAccount: [
    {
      id: 'bank-1',
      question: 'What type of bank account opening?',
      options: ['Savings Account', 'Current Account', 'Salary Account', 'NRI Account'],
      nextStep: () => 'bank-2'
    },
    {
      id: 'bank-2',
      question: 'Select the bank',
      options: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'],
      nextStep: () => 'bank-3'
    },
    {
      id: 'bank-3',
      question: 'Upload identity proof',
      requiresUpload: true,
      uploadType: 'Identity Proof (PAN, Aadhaar)',
      nextStep: () => 'bank-4'
    },
    {
      id: 'bank-4',
      question: 'Upload address proof',
      requiresUpload: true,
      uploadType: 'Address Proof',
      nextStep: () => 'bank-5'
    },
    {
      id: 'bank-5',
      question: 'Upload passport size photograph',
      requiresUpload: true,
      uploadType: 'Photograph',
      nextStep: () => 'bank-complete'
    },
    {
      id: 'bank-complete',
      question: '✅ Bank account application completed! Account will be activated within 2-3 days.',
      options: ['Start New Process', 'Exit']
    }
  ]
};

const SOPChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your SOP Assistant. I\'ll guide you through the process step by step. What would you like to help your client with today?',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'options',
      content: '',
      options: ['Mutual Funds', 'Loans', 'Bank Account Opening'],
      timestamp: new Date()
    }
  ]);
  const [currentFlow, setCurrentFlow] = useState<SOPStep[] | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionSelect = (option: string) => {
    addMessage({ type: 'user', content: option });

    if (option === 'Start New Process') {
      resetChat();
      return;
    }

    if (option === 'Exit') {
      setIsOpen(false);
      return;
    }

    if (!currentFlow) {
      let flow: SOPStep[] = [];
      if (option === 'Mutual Funds') flow = sopFlows.mutualFunds;
      else if (option === 'Loans') flow = sopFlows.loans;
      else if (option === 'Bank Account Opening') flow = sopFlows.bankAccount;

      setCurrentFlow(flow);
      setCurrentStepIndex(0);
      
      setTimeout(() => {
        const step = flow[0];
        addMessage({ type: 'bot', content: step.question });
        if (step.options) {
          addMessage({ type: 'options', content: '', options: step.options });
        } else if (step.requiresUpload) {
          addMessage({ type: 'upload', content: '', uploadType: step.uploadType });
        }
      }, 500);
    } else {
      proceedToNextStep(option);
    }
  };

  const proceedToNextStep = (answer: string) => {
    if (!currentFlow) return;

    const nextIndex = currentStepIndex + 1;

    if (nextIndex < currentFlow.length) {
      setCurrentStepIndex(nextIndex);
      const nextStep = currentFlow[nextIndex];

      setTimeout(() => {
        addMessage({ type: 'bot', content: nextStep.question });
        if (nextStep.options) {
          addMessage({ type: 'options', content: '', options: nextStep.options });
        } else if (nextStep.requiresUpload) {
          addMessage({ type: 'upload', content: '', uploadType: nextStep.uploadType });
        }
      }, 500);
    }
  };

  const handleTextSubmit = () => {
    if (!inputValue.trim()) return;

    addMessage({ type: 'user', content: inputValue });
    setInputValue('');
    proceedToNextStep(inputValue);
  };

  const handleFileUpload = (uploadType: string) => {
    setUploadedFiles(prev => ({ ...prev, [uploadType]: 'uploaded' }));
    addMessage({ type: 'user', content: `✓ ${uploadType} uploaded successfully` });
    
    setTimeout(() => {
      proceedToNextStep('uploaded');
    }, 500);
  };

  const resetChat = () => {
    setCurrentFlow(null);
    setCurrentStepIndex(0);
    setUploadedFiles({});
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'What would you like to help your client with?',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'options',
        content: '',
        options: ['Mutual Funds', 'Loans', 'Bank Account Opening'],
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-background rounded-2xl shadow-2xl border border-border z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">SOP Assistant</h3>
                  <p className="text-xs opacity-90">Step-by-step guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.type === 'bot' && (
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  )}

                  {message.type === 'user' && (
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  )}

                  {message.type === 'options' && message.options && (
                    <div className="flex flex-col gap-2 ml-10">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(option)}
                          className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                        >
                          <span className="text-sm font-medium">{option}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </button>
                      ))}
                    </div>
                  )}

                  {message.type === 'upload' && message.uploadType && (
                    <div className="ml-10">
                      <Card className="p-4 border-dashed border-2 hover:border-primary transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium mb-1">{message.uploadType}</p>
                          <Button
                            size="sm"
                            onClick={() => handleFileUpload(message.uploadType!)}
                            disabled={uploadedFiles[message.uploadType!]}
                            className="mt-2"
                          >
                            {uploadedFiles[message.uploadType!] ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Uploaded
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload File
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {currentFlow && !currentFlow[currentStepIndex]?.options && !currentFlow[currentStepIndex]?.requiresUpload && (
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    placeholder="Type your answer..."
                    className="flex-1"
                  />
                  <Button onClick={handleTextSubmit} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOPChatbot;
