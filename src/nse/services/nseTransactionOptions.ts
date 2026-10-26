// NSE_MF_WebfileStructure.pdf: SIP p84, XSIP p89, STP p108, SWP p110.
export const NSE_DOCUMENT_PLAN_FREQUENCIES = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI-ANNUALLY', 'ANNUALLY', 'DAILY'] as const;
export const NSE_DOCUMENT_SWP_FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'] as const;
export const NSE_DOCUMENT_ORDER_MODES = [['C', 'CDSL demat (C)'], ['N', 'NSDL demat (N)'], ['P', 'Physical (P)']] as const;
export const NSE_DOCUMENT_PURCHASE_TYPES = [['FRESH', 'Fresh purchase'], ['ADDITIONAL', 'Additional purchase']] as const;
