'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Plus, Star, Tag, Upload, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@supabase/supabase-js'
import { useUser } from '@clerk/nextjs'
import Markdown from '@/components/Markdown';

interface WeatherInfo {
  temperature: string;
  weather: string;
  humidity: string;
  windpower: string;
  winddirection: string;
  reporttime: string;
  city: string;
  cityname: string;
}

interface ClothingItem {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  season: string[];
  tags: string[];
  isFavorite: boolean;
}

// 热门城市列表
const popularCities = [
  { code: '110101', name: '北京' },    // 北京市东城区
  { code: '310101', name: '上海' },    // 上海市黄浦区
  { code: '440100', name: '广州' },    // 广州市
  { code: '440300', name: '深圳' },    // 深圳市
  { code: '330100', name: '杭州' },    // 杭州市
  { code: '320100', name: '南京' },    // 南京市
  { code: '420100', name: '武汉' },    // 武汉市
  { code: '510100', name: '成都' },    // 成都市
  { code: '340100', name: '合肥' },    // 合肥市
  { code: '340700', name: '铜陵' },    // 铜陵市
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const Dashboard = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [selectedCity, setSelectedCity] = useState('110101'); // 默认北京
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState("");
  const { user } = useUser();
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(false);

  // 获取天气数据
  const fetchWeatherData = async (cityCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=7905208db1abaab5a37c692f683e9497&extensions=base&output=JSON`
      );
      const data = await response.json();
      if (data.status === '1' && data.lives && data.lives.length > 0) {
        setWeatherInfo(data.lives[0]);
      } else {
        setWeatherInfo(null);
        setError('该城市暂不支持天气查询');
      }
    } catch (err) {
      setError('获取天气数据失败');
      setWeatherInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  // 拉取当前用户衣柜数据
  useEffect(() => {
    if (!user) return;
    const fetchWardrobe = async () => {
      setWardrobeLoading(true);
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setWardrobeItems([]);
      } else {
        setWardrobeItems(data || []);
      }
      setWardrobeLoading(false);
    };
    fetchWardrobe();
  }, [user]);

  const handleGenerate = async () => {
    if (!query) return;
    setRecoLoading(true);
    setRecoError("");
    setRecommendation("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          weather: weatherInfo,
          wardrobe: wardrobeItems,
        }),
      });
      if (!res.body) throw new Error("无响应体");
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let text = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          text += chunk;
          setRecommendation(text);
          if (chunk.trim()) setRecoError("");
          console.log("流式接收内容：", chunk);
        }
      }
    } catch (err: any) {
      setRecoError("推荐失败");
      console.error("推荐失败详细错误：", err);
    } finally {
      setRecoLoading(false);
    }
  };

  const getWeatherIcon = (weather?: string) => {
    if (!weather) return <Cloud className="h-8 w-8 text-gray-400" />;
    if (weather.includes('晴')) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (weather.includes('云') || weather.includes('阴')) return <Cloud className="h-8 w-8 text-gray-500" />;
    if (weather.includes('雨')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (weather.includes('雪')) return <CloudSnow className="h-8 w-8 text-blue-300" />;
    return <Cloud className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">智能穿搭助手</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            添加衣物
          </Button>
          <Button
            className="flex items-center gap-2 bg-[#880000] hover:bg-[#a33a3a] text-white rounded-lg px-4 py-2 shadow-none"
            onClick={handleGenerate}
            aria-label="生成搭配"
            tabIndex={0}
            disabled={recoLoading || !query}
          >
            <Plus className="h-4 w-4" />
            生成搭配
          </Button>
        </div>
      </header>

      {/* 天气信息卡片 */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>今日天气</CardTitle>
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择城市" />
            </SelectTrigger>
            <SelectContent>
              {popularCities.map((city) => (
                <SelectItem key={city.code} value={city.code}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : weatherInfo ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weatherInfo.weather)}
                <div>
                  <p className="text-3xl font-bold">{weatherInfo.temperature}°C</p>
                  <p className="text-sm text-gray-500">{weatherInfo.city || weatherInfo.cityname || popularCities.find(city => city.code === selectedCity)?.name}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <Wind className="h-5 w-5 mx-auto text-gray-500" />
                  <p className="text-sm">{weatherInfo.windpower}级</p>
                  <p className="text-xs text-gray-500">{weatherInfo.winddirection}风</p>
                </div>
                <div className="text-center">
                  <Cloud className="h-5 w-5 mx-auto text-gray-500" />
                  <p className="text-sm">{weatherInfo.humidity}%</p>
                  <p className="text-xs text-gray-500">湿度</p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* 用户 query 输入框和推荐结果展示 */}
      <div className="max-w-xl mx-auto flex flex-col gap-4 items-center">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="今天要去面试，帮我推荐穿搭"
          className="rounded-lg border border-gray-200 bg-gray-50 focus:border-[#880000] focus:ring-0 px-4 py-3 text-lg text-gray-800 w-full shadow-none"
          aria-label="请输入你的穿搭需求"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
          disabled={recoLoading}
        />
        {recoLoading && <div className="text-gray-400 text-sm">正在生成推荐...</div>}
        {recommendation
          ? <div className="w-full bg-white border border-gray-100 rounded-lg p-4 text-gray-800 text-base mt-2 shadow-sm">
              <Markdown>{recommendation}</Markdown>
            </div>
          : recoError && <div className="text-red-500 text-sm">{recoError}</div>
        }
      </div>
    </div>
  );
};

export default Dashboard;