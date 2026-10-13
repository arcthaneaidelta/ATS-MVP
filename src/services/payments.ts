export interface PaymentResult {
  success: boolean;
  status: 'approved' | 'declined' | 'requires_3ds';
  message: string;
  transactionId?: string;
}

export async function processPayment(
  cardNumber: string,
  onStepChange?: (step: string) => void
): Promise<PaymentResult> {
  const cleanCard = cardNumber.replace(/\s+/g, '');

  if (onStepChange) onStepChange('Authorising...');
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (cleanCard === '4000000000000002') {
    return {
      success: false,
      status: 'declined',
      message: 'Your card was declined by the issuer. Try another card.',
    };
  }

  if (cleanCard === '4000000000003220') {
    return {
      success: false,
      status: 'requires_3ds',
      message: 'Additional authentication required (3-D Secure).',
    };
  }

  if (onStepChange) onStepChange('Confirming with bank...');
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    success: true,
    status: 'approved',
    message: 'Payment approved successfully.',
    transactionId: `tx_${Math.random().toString(36).substring(2, 9)}`,
  };
}
