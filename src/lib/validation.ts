/**
 * Validation utilities cho form liên hệ
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate họ tên - chỉ chấp nhận chữ cái và khoảng trắng
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Vui lòng nhập họ và tên' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Họ tên phải có ít nhất 2 ký tự' };
  }

  // Cho phép chữ cái tiếng Việt có dấu, khoảng trắng
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'Họ tên chỉ được chứa chữ cái, không được chứa số hoặc ký tự đặc biệt' };
  }

  return { isValid: true };
};

/**
 * Validate số điện thoại Việt Nam
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Vui lòng nhập số điện thoại' };
  }

  // Loại bỏ khoảng trắng, dấu gạch ngang
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Chỉ chấp nhận số
  const digitRegex = /^\d+$/;
  if (!digitRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Số điện thoại chỉ được chứa chữ số' };
  }

  // Validate format số điện thoại Việt Nam
  // Các đầu số hợp lệ: 03, 05, 07, 08, 09 (10 số)
  // Hoặc format cũ: 01 (11 số)
  // Hoặc có +84 đầu
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
  const oldFormatRegex = /^(\+84|84|0)1\d{9}$/;

  if (!phoneRegex.test(cleanPhone) && !oldFormatRegex.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10-11 số, bắt đầu bằng 03, 05, 07, 08, 09)' 
    };
  }

  return { isValid: true };
};

/**
 * Validate email - kiểm tra format cơ bản
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Vui lòng nhập email' };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Email không đúng định dạng' };
  }

  // Kiểm tra domain hợp lệ
  const domain = email.trim().toLowerCase().split('@')[1];
  
  // Kiểm tra domain có ít nhất 1 dấu chấm và phần sau dấu chấm có ít nhất 2 ký tự
  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
    return { isValid: false, error: 'Email không hợp lệ. Vui lòng kiểm tra lại tên miền' };
  }

  return { isValid: true };
};

/**
 * Validate message
 */
export const validateMessage = (message: string): { isValid: boolean; error?: string } => {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Vui lòng nhập tin nhắn' };
  }

  if (message.trim().length < 10) {
    return { isValid: false, error: 'Tin nhắn phải có ít nhất 10 ký tự' };
  }

  return { isValid: true };
};

/**
 * Validate toàn bộ form liên hệ
 */
export const validateContactForm = (formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.error! });
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.push({ field: 'email', message: emailValidation.error! });
  }

  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.push({ field: 'phone', message: phoneValidation.error! });
  }

  const messageValidation = validateMessage(formData.message);
  if (!messageValidation.isValid) {
    errors.push({ field: 'message', message: messageValidation.error! });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize phone number - chỉ giữ lại số
 */
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d]/g, '');
};
