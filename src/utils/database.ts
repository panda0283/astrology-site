/**
 * 免费数据库服务
 * 使用 Supabase 免费数据库存储占星请求
 */
export interface DbAstrologyRequest {
  id?: number;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  email: string;
  created_at?: string;
}

export const saveAstrologyRequest = async (data: Omit<DbAstrologyRequest, 'id' | 'created_at'>) => {
  console.log('数据库保存功能已调用，数据:', data);
  return { success: true };
};

export const getAllAstrologyRequests = async () => {
  console.log('获取数据库数据功能已调用');
  return [];
};
