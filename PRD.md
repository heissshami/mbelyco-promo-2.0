export class PromoCodeGenerator {
  private static readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  static generateCode(createdAt: Date): string {
    const random = (length: number): string => {
      return Array.from({ length }, () => 
        this.CHARS[Math.floor(Math.random() * this.CHARS.length)]
      ).join('');
    };
    
    const YY = createdAt.getFullYear().toString().slice(-2);
    const MM = String(createdAt.getMonth() + 1).padStart(2, '0');
    const DD = String(createdAt.getDate()).padStart(2, '0');
    
    return `${random(4)}-${random(2)}${YY}-${random(2)}${MM}-${random(2)}${DD}`;
  }
  
  static validateCode(code: string): boolean {
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{2}[0-9]{2}-[A-Z0-9]{2}[0-9]{2}-[A-Z0-9]{2}[0-9]{2}$/;
    return pattern.test(code);
  }
}

export class USSDService {
  async handleUSSDRequest(request: USSDRequest): Promise<USSDResponse> {
    try {
      // Auto-register user if not exists
      const user = await this.ensureUserExists(request.phoneNumber);
      
      // Parse USSD input
      const input = request.text?.trim();
      
      if (!input) {
        return this.showWelcomeMessage();
      }
      
      // Validate promo code format
      if (!PromoCodeGenerator.validateCode(input)) {
        return this.showInvalidCodeMessage();
      }
      
      // Check idempotency
      const existingRedemption = await this.checkExistingRedemption(
        user.id, 
        input
      );
      
      if (existingRedemption) {
        return this.showAlreadyRedeemedMessage();
      }
      
      // Process redemption
      const redemption = await this.processRedemption(user.id, input);
      
      if (redemption.success) {
        return this.showSuccessMessage(redemption.amount);
      } else {
        return this.showErrorMessage(redemption.error);
      }
      
    } catch (error) {
      console.error('USSD processing error:', error);
      return this.showErrorMessage('System temporarily unavailable');
    }
  }
  
  private async ensureUserExists(phoneNumber: string): Promise<User> {
    let user = await this.userRepository.findByPhoneNumber(phoneNumber);
    
    if (!user) {
      user = await this.userRepository.create({
        phone_number: phoneNumber,
        is_active: true,
        is_verified: true
      });
    }
    
    return user;
  }
}

export class DisbursementProcessor {
  async processDisbursement(job: DisbursementJob): Promise<void> {
    const { redemptionId, amount, phoneNumber } = job.data;
    
    try {
      // Process MoMo disbursement
      const momoResponse = await this.momoService.transfer({
        amount,
        phoneNumber,
        reference: `REDEEM-${redemptionId}`
      });
      
      // Update redemption status
      await this.redemptionRepository.update(redemptionId, {
        status: 'completed',
        momo_transaction_id: momoResponse.transactionId,
        momo_reference: momoResponse.reference,
        disbursed_at: new Date()
      });
      
      // Log audit trail
      await this.auditLogger.log({
        action: 'disbursement_completed',
        entity_type: 'redemption',
        entity_id: redemptionId,
        new_values: { status: 'completed' }
      });
      
    } catch (error) {
      // Mark as failed after max retries
      if (job.attemptsMade >= job.opts.attempts) {
        await this.redemptionRepository.update(redemptionId, {
          status: 'failed',
          error_message: error.message
        });
        
        // Send alert to admin
        await this.notificationService.sendAlert({
          type: 'disbursement_failed',
          redemptionId,
          error: error.message
        });
      } else {
        throw error; // Retry
      }
    }
  }
}