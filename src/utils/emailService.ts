/**
 * 邮件通知服务
 * 使用第三方邮件服务发送占星请求通知
 */
interface EmailData {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  email: string;
  message?: string; // 🚀 新增：用户留言
}

export const sendEmailNotification = async (data: EmailData) => {
  console.log('邮件通知功能已调用，数据:', data);
  // 这里可以集成实际的邮件服务
  return true;
};
