import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LegalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const legalContent = {
  'Privacy Policy': `
    <h3>Information We Collect</h3>
    <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
    
    <h3>How We Use Your Information</h3>
    <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
    
    <h3>Information Sharing</h3>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
    
    <h3>Data Security</h3>
    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
  `,
  'Terms of Service': `
    <h3>Acceptance of Terms</h3>
    <p>By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
    
    <h3>Use License</h3>
    <p>Permission is granted to temporarily use our platform for personal, non-commercial transitory viewing only.</p>
    
    <h3>Disclaimer</h3>
    <p>The materials on our platform are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
    
    <h3>Limitations</h3>
    <p>In no event shall Lendrix or its suppliers be liable for any damages arising out of the use or inability to use our platform.</p>
  `,
  'Compliance': `
    <h3>Regulatory Compliance</h3>
    <p>Lendrix is committed to maintaining the highest standards of regulatory compliance across all our services.</p>
    
    <h3>RBI Compliance</h3>
    <p>Our lending services are regulated by the Reserve Bank of India (RBI) and comply with all applicable guidelines.</p>
    
    <h3>SEBI Compliance</h3>
    <p>Our investment advisory services are regulated by the Securities and Exchange Board of India (SEBI).</p>
    
    <h3>Data Protection</h3>
    <p>We comply with all applicable data protection laws and maintain strict confidentiality of customer information.</p>
  `,
  'Disclaimer': `
    <h3>Investment Risks</h3>
    <p>All investments are subject to market risks. Past performance does not guarantee future results.</p>
    
    <h3>Loan Approval</h3>
    <p>Loan approvals are subject to credit assessment and lender policies. Lendrix acts as an intermediary.</p>
    
    <h3>Property Information</h3>
    <p>Property information is provided by third parties. We recommend independent verification before making decisions.</p>
    
    <h3>Professional Advice</h3>
    <p>Information provided is for general guidance only and should not be considered as professional financial advice.</p>
  `
};

const LegalPopup: React.FC<LegalPopupProps> = ({ isOpen, onClose, title }) => {
  const content = legalContent[title as keyof typeof legalContent] || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LegalPopup;