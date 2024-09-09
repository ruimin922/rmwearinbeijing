import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sun, Cloud, CloudRain } from "lucide-react";

const WeatherApp: React.FC = () => {
  return (
    <div className="w-[1938px] h-[1050px] bg-gray-100 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">上海天气预报</h1>
      <p className="text-xl mb-8">当前时间：2024年9月9日 14:44:59</p>
      <div className="flex space-x-8">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">9月9日</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Sun className="w-24 h-24 text-yellow-500 mb-4" />
            <p className="text-2xl font-semibold">晴天</p>
            <p className="text-xl">28°C / 20°C</p>
          </CardContent>
        </Card>
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">9月10日</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Cloud className="w-24 h-24 text-gray-500 mb-4" />
            <p className="text-2xl font-semibold">多云</p>
            <p className="text-xl">26°C / 19°C</p>
          </CardContent>
        </Card>
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">9月11日</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CloudRain className="w-24 h-24 text-blue-500 mb-4" />
            <p className="text-2xl font-semibold">小雨</p>
            <p className="text-xl">24°C / 18°C</p>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-8 w-3/4" />
      <p className="text-lg text-gray-600">数据来源：模拟天气预报，仅供参考</p>
    </div>
  );
};

export default WeatherApp;