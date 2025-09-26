/**
 * 占星服务模块
 * 收集用户出生信息，提供星盘解读服务
 */
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { siteConfigAtom, addAstrologyRequestAtom } from '../../stores/configStore';
import { Star, Calendar, MapPin, Mail, Coffee, AlertCircle, MessageCircle } from 'lucide-react'; // 🚀 新增图标
import toast from 'react-hot-toast';
import { cityData, getPopularCities, getDistricts } from './cityData';

const AstrologySection: React.FC = () => {
  const [config] = useAtom(siteConfigAtom);
  const [, addRequest] = useAtom(addAstrologyRequestAtom);
  
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthDistrict: '',
    email: '',
    message: '' // 🚀 新增：用户留言
  });
  
  // 🚀 添加城市和区县选项状态
  const [cities] = useState(getPopularCities());
  const [districts, setDistricts] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessageField, setShowMessageField] = useState(false); // 🚀 新增：控制留言框显示

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🚀 城市变化处理函数 - 简化版
  const handleCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, birthCity: city, birthDistrict: '' }));
    const availableDistricts = getDistricts(city);
    setDistricts(availableDistricts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 表单提交开始');
    setIsSubmitting(true);
    
    try {
      console.log('🔍 开始验证表单数据');
      
      if (!formData.birthDate || !formData.birthTime || !formData.birthCity || !formData.birthDistrict || !formData.email) {
        console.log('❌ 表单验证失败: 数据不完整');
        toast.error('请填写完整信息');
        return;
      }
      
      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        console.log('❌ 邮箱格式验证失败');
        toast.error('请输入正确的邮箱格式');
        return;
      }
      
      console.log('✅ 表单验证通过');
      
      console.log('💾 开始保存数据...');
      
      // 🚀 关键修复：添加try-catch保护每个步骤
      let saveSuccess = false;
      try {
        addRequest({
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthLocation: `${formData.birthCity}，${formData.birthDistrict}`,
          email: formData.email,
          message: formData.message || undefined, // 🚀 新增：保存留言
          timestamp: Date.now()
        });
        saveSuccess = true;
        console.log('✅ 数据保存成功');
      } catch (saveError) {
        console.log(`❌ 数据保存失败: ${String(saveError)}`);
        throw new Error(`数据保存失败: ${String(saveError)}`);
      }
      
      // 🎉 成功处理
      console.log('🎉 表单提交成功！');
      toast.success('提交成功！我会在周末为您解读星盘');
      
      // 清空表单
      setFormData({
        birthDate: '',
        birthTime: '',
        birthCity: '',
        birthDistrict: '',
        email: '',
        message: '' // 🚀 新增：清空留言
      });
      
      setShowMessageField(false); // 🚀 隐藏留言框
      
      console.log('🧹 表单已清空');
      
    } catch (error) {
      console.log(`❌ 提交过程失败: ${String(error)}`);
      
      let userMessage = '提交失败，请重试';
      if (error instanceof Error) {
        if (error.message.includes('localStorage')) {
          userMessage = '浏览器存储失败，请检查浏览器设置';
        } else if (error.message.includes('network')) {
          userMessage = '网络连接失败，请检查网络';
        } else if (error.message.includes('timeout')) {
          userMessage = '请求超时，请稍后重试';
        }
      }
      
      toast.error(userMessage);
      
    } finally {
      setIsSubmitting(false);
      console.log('🏁 提交过程结束');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-5 border border-orange-100/50 relative">
      
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mb-3 shadow-lg shadow-orange-200/50">
          <Star className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {config.astrology.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {config.astrology.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <Calendar className="w-3 h-3 inline mr-1" />
              出生日期（阳历）
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <Calendar className="w-3 h-3 inline mr-1" />
              出生时间
            </label>
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => handleInputChange('birthTime', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <MapPin className="w-3 h-3 inline mr-1" />
              出生城市
            </label>
            <select
              value={formData.birthCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            >
              <option value="" disabled>请选择城市</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <MapPin className="w-3 h-3 inline mr-1" />
              出生区县
            </label>
            <select
              value={formData.birthDistrict}
              onChange={(e) => handleInputChange('birthDistrict', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            >
              <option value="" disabled>请选择区县</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            <Mail className="w-3 h-3 inline mr-1" />
            联系邮箱
          </label>
          <input
            type="email"
            placeholder="用于接收星盘解读结果"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* 🚀 新增：留言功能 - 可选的开放填空区 */}
        {showMessageField ? (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <MessageCircle className="w-3 h-3 inline mr-1" />
              给我留言（可选）
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="请告诉我您想重点关注的领域，比如：事业发展、感情关系、健康状况等..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.message.length}/500
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowMessageField(true)}
            className="w-full text-left px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:text-orange-600 transition-all"
          >
            <MessageCircle className="w-3 h-3 inline mr-1" />
            给我留言（可选）💬
          </button>
        )}

        {/* 🚀 增强提交按钮，显示状态 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white py-2.5 px-6 rounded-lg font-medium hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200/50 text-sm relative overflow-hidden"
        >
          {isSubmitting ? (
            <>
              <span className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                提交中...
              </span>
            </>
          ) : (
            '✨ 提交星盘需求'
          )}
        </button>
      </form>
      
      {/* 🚀 添加系统信息面板 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span>系统状态</span>
          <span className={`px-2 py-1 rounded text-xs ${
            typeof(Storage) !== "undefined" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {typeof(Storage) !== "undefined" ? '✅ 存储正常' : '❌ 存储异常'}
          </span>
        </div>
        <div className="text-xs">
          <div>浏览器: {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : '其他'}</div>
        </div>
      </div>
    </div>
  );
};

export default AstrologySection;
