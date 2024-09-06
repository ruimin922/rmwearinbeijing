import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw } from "lucide-react";

export default function MenuDisplay() {
  const dishes = [
    { name: "招牌菜1", image: "招牌菜1.png" },
    { name: "招牌菜2", image: "招牌菜2.png" },
    { name: "招牌菜3", image: "招牌菜3.png" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[891px] w-[1694px] bg-gray-100">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>青椒鱼之家</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8">
            {dishes.map((dish, index) => (
              <div key={index}>
                <CardTitle>{dish.name}</CardTitle>
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" /> 导航到这里
          </Button>
          <Button variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" /> 换其他餐厅
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          当前时间: 2024/9/5 17:02:11
        </p>
      </Card>
    </div>
  );
}