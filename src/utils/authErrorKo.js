export function authErrorToKo(err) {
  if (!err) return '로그인에 실패했어요. 잠시 후 다시 시도해주세요.';

  const raw = String(err.message || '').toLowerCase();
  const status = err.status;         // supabase AuthApiError에 있음
  const name = err.name || '';       // 'AuthApiError' | 'TypeError' 등

  // 네트워크/오프라인
  if (name === 'TypeError' || raw.includes('failed to fetch') || raw.includes('network'))
    return '네트워크 연결을 확인해주세요.';

  // 과도한 요청
  if (status === 429 || raw.includes('rate limit'))
    return '요청이 너무 많아요. 잠시 후 다시 시도해주세요.';

  // 인증 관련 (주요 케이스)
  if (status === 400) {
    if (raw.includes('invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않아요.';
    if (raw.includes('email not confirmed'))       return '이메일 인증이 필요해요. 받은 메일의 확인 링크를 눌러주세요.';
    if (raw.includes('otp') || raw.includes('code')) return '인증 코드가 올바르지 않아요.';
    if (raw.includes('token'))                     return '세션 토큰이 만료되었어요. 다시 시도해주세요.';
  }
  if (status === 401) return '세션이 만료되었어요. 다시 로그인해주세요.';
  if (status === 403) return '접근 권한이 없어요.';
  if (status === 404) return '해당 계정을 찾을 수 없어요.';
  if (status === 422) {
    if (raw.includes('email'))    return '이메일 형식을 확인해주세요.';
    if (raw.includes('password')) return '비밀번호 형식을 확인해주세요.';
    return '입력값을 확인해주세요.';
  }
  if (status >= 500) return '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.';

  // 기본 메시지
  return '로그인에 실패했어요. 잠시 후 다시 시도해주세요.';
}
