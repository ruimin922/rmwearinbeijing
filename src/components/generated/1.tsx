import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cloud, Sun, Thermometer } from 'lucide-react';

const WeatherDashboard: React.FC = () => {
  return (
    <div className="w-[2080px] h-[1005px] bg-gray-100 p-8 flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">上海天气预报</h1>
        <p className="text-xl text-gray-600">2024年9月9日 17:01:19</p>
      </header>
      
      <div className="flex-1 grid grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">今日天气</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around">
            <div className="text-center">
              <Sun className="w-24 h-24 text-yellow-400 mx-auto" />
              <p className="text-5xl font-bold mt-4">28°C</p>
              <p className="text-xl mt-2">晴朗</p>
            </div>
            <Separator orientation="vertical" className="h-40" />
            <div>
              <p className="text-xl mb-2"><Thermometer className="inline mr-2" /> 最高温度: 31°C</p>
              <p className="text-xl mb-2"><Thermometer className="inline mr-2" /> 最低温度: 24°C</p>
              <p className="text-xl mb-2"><Cloud className="inline mr-2" /> 湿度: 65%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">未来预报</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {['周二', '周三', '周四', '周五'].map(day => (
                <li key={day} className="flex justify-between items-center">
                  <span>{day}</span>
                  <Sun className="w-6 h-6 text-yellow-400" />
                  <span>26°C / 22°C</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <footer className="mt-8 text-center text-gray-600">
        数据更新时间：2024年9月9日 17:00
      </footer>
    </div>
  );
};

export default WeatherDashboard;