/**
 * Utilitário para formatação de números de telefone no padrão brasileiro
 * Formato: +55(99)99999-9999
 */

export const formatPhoneBR = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é número
  let digits = value.replace(/\D/g, '');
  
  // Garante que começa com 55 (Brasil)
  if (!digits.startsWith('55')) {
    digits = '55' + digits;
  }
  
  // Limita a 13 dígitos (55 + 2 DDD + 9 número)
  digits = digits.slice(0, 13);
  
  // Aplica a formatação +55(XX)XXXXX-XXXX
  if (digits.length <= 2) {
    return `+${digits}`;
  } else if (digits.length <= 4) {
    return `+${digits.slice(0, 2)}(${digits.slice(2)}`;
  } else if (digits.length <= 9) {
    return `+${digits.slice(0, 2)}(${digits.slice(2, 4)})${digits.slice(4)}`;
  } else {
    return `+${digits.slice(0, 2)}(${digits.slice(2, 4)})${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
};

/**
 * Valida se o telefone está no formato correto
 * @param {string} phone - Número de telefone
 * @returns {boolean} - True se válido
 */
export const validatePhoneBR = (phone) => {
  const phoneRegex = /^\+55\(\d{2}\)\d{5}-\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Remove a formatação do telefone, mantendo apenas os dígitos
 * @param {string} phone - Número formatado
 * @returns {string} - Apenas dígitos
 */
export const cleanPhone = (phone) => {
  return phone.replace(/\D/g, '');
};