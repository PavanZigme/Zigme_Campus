export function validateLoginForm(formData, isOTP) {
    const errors = [];
    
    if (!formData.email?.trim()) {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Invalid email format');
    }
    
    if (!isOTP && !formData.password?.trim()) {
        errors.push('Password is required');
    }
    
    if (isOTP && !formData.otp?.trim()) {
        errors.push('OTP is required');
    }
    
    return errors;
} 