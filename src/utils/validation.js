const ROLE_MESSAGES = 'This is not empty';
const ROLE_REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ROLE_ERRORS_EMAIL = 'Invalid email format';
const ROLE_REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const ROLE_ERRORS_PASSWORD =
  'Password must contain at least one letter and one number and be at least 8 characters long';
const ROLE_REGEX_FULLNAME = /^[a-zA-Z\s]+$/;
const ROLE_ERRORS_FULLNAME = 'Full name must contain only letters and spaces';
// validateFile.js

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp"
];

const validateImage = (file) => {
  // ❌ Không có file
  if (!file) {
    return {
      isValid: false,
      message: "Vui lòng chọn file"
    };
  }

  // ❌ Sai định dạng
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      message: "Chỉ chấp nhận file JPG, PNG, WEBP"
    };
  }

  // ❌ Quá dung lượng
  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      message: "File phải nhỏ hơn 10MB"
    };
  }

  // ✅ OK
  return {
    isValid: true,
    message: "Valid"
  };
};
export {
  ROLE_MESSAGES,
  ROLE_REGEX_EMAIL,
  ROLE_ERRORS_EMAIL,
  ROLE_REGEX_PASSWORD,
  ROLE_ERRORS_PASSWORD,
  ROLE_REGEX_FULLNAME,
  ROLE_ERRORS_FULLNAME,
  validateImage
};
