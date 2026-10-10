import { useStore } from '@/store/useStore'

function getSimulatedLatency(): number {
  const isSlow = useStore.getState().scenarios.slowNetwork
  if (isSlow) {
    return Math.floor(Math.random() * (3000 - 1800 + 1)) + 1800
  }
  return Math.floor(Math.random() * (900 - 250 + 1)) + 250
}

export function waitLatency(customMs?: number): Promise<void> {
  const ms = customMs ?? getSimulatedLatency()
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const mockApi = {
  async processPayment(cardOrPhone: string, amountBwp: number): Promise<{ success: boolean; status: 'SUCCESS' | 'DECLINED' | 'CANCELLED' | 'PENDING' }> {
    await waitLatency()
    const { scenarios } = useStore.getState()

    if (scenarios.paymentDeclinedNext || cardOrPhone.replace(/\s+/g, '') === '4000000000000002') {
      useStore.getState().setScenarioFlag('paymentDeclinedNext', false)
      throw new Error('PAYMENT_DECLINED: Your bank declined this payment. Try another method.')
    }

    if (scenarios.paymentPendingNext) {
      useStore.getState().setScenarioFlag('paymentPendingNext', false)
      return { success: true, status: 'PENDING' }
    }

    return { success: true, status: 'SUCCESS' }
  },

  async downloadFile(filename: string): Promise<{ success: boolean; filename: string }> {
    await waitLatency(1200)
    const { scenarios } = useStore.getState()

    if (scenarios.downloadFailsNext) {
      useStore.getState().setScenarioFlag('downloadFailsNext', false)
      throw new Error('DOWNLOAD_FAILED: Download failed. Network connection interrupted.')
    }

    return { success: true, filename }
  },

  async validateCoupon(code: string): Promise<{ valid: boolean; discountPercent: number }> {
    await waitLatency(500)
    if (code.trim().toUpperCase() === 'FIRSTBID10') {
      return { valid: true, discountPercent: 10 }
    }
    return { valid: false, discountPercent: 0 }
  },
}
