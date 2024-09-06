import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sun, Cloud, Thermometer } from "lucide-react";

const WeatherApp: React.FC = () => {
  return (
    <div className="w-[1938px] h-[1048px] bg-gradient-to-b from-blue-400 to-blue-600 p-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Weather Report</h1>
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl">Today's Weather - September 5, 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sun className="h-16 w-16 text-yellow-500 mr-4" />
              <div>
                <p className="text-3xl font-semibold">Sunny</p>
                <p className="text-xl">Clear skies</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">28°C</p>
              <p className="text-xl">Feels like 30°C</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Cloud className="h-8 w-8 text-gray-500 mb-2" />
              <p className="text-sm">Humidity</p>
              <p className="font-semibold">45%</p>
            </div>
            <div className="flex flex-col items-center">
              <Thermometer className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm">Max Temp</p>
              <p className="font-semibold">31°C</p>
            </div>
            <div className="flex flex-col items-center">
              <Thermometer className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm">Min Temp</p>
              <p className="font-semibold">22°C</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-white mt-8 text-lg">Current time: 23:21:46</p>
    </div>
  );
};

export default WeatherApp;