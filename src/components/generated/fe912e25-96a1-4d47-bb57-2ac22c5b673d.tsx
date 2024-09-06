import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PenIcon, ImageIcon, TagIcon, SearchIcon, BellIcon, UserIcon, BookOpenIcon, StarIcon, HeartIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function JournalComponent() {
  return (
    <div className="w-[1440px] h-[706px] bg-gray-100 p-4 flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">我的手账本</h1>
        <div className="flex items-center space-x-4">
          <Input className="w-64" placeholder="搜索..." icon={<SearchIcon className="h-4 w-4" />} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BellIcon className="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>新消息通知</DropdownMenuItem>
              <DropdownMenuItem>系统更新提醒</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <div className="flex gap-4 flex-1">
        <Card className="w-2/3 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpenIcon className="mr-2" />
              阅读手账
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Tabs defaultValue="content" className="flex-1 flex flex-col">
              <TabsList>
                <TabsTrigger value="content">内容</TabsTrigger>
                <TabsTrigger value="notes">笔记</TabsTrigger>
                <TabsTrigger value="quotes">精彩片段</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="flex-1 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-2">《百年孤独》</h2>
                <p className="text-gray-700 mb-4">
                  许多年后，奥雷里亚诺·布恩迪亚上校站在行刑队面前，准会想起父亲带他去参观冰块的那个遥远的下午。当时，马孔多是个二十户人家的村庄，一座座土房都盖在河岸上，河水清澈，沿着遍布石头的河床流去，河里的石头光滑、洁白，活像史前的巨蛋。
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <StarIcon className="text-yellow-400 mr-1" />
                    <span className="text-sm">4.9 / 5.0</span>
                  </div>
                  <Badge>经典文学</Badge>
                </div>
                <Progress value={75} className="mb-2" />
                <span className="text-sm text-gray-500">阅读进度：75%</span>
              </TabsContent>
              <TabsContent value="notes" className="flex-1">
                <Textarea className="h-full mb-2" placeholder="在这里记录你的读书笔记..." />
              </TabsContent>
              <TabsContent value="quotes" className="flex-1">
                <ul className="space-y-2">
                  <li className="bg-white p-3 rounded shadow">
                    "世界上没有人能够完全了解另一个人，我们终其一生都在抓住一些碎片。"
                  </li>
                  <li className="bg-white p-3 rounded shadow">
                    "生命中曾经有过的所有灿烂，终究都要靠自己来记住。"
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2" />
                阅读日历
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-xl font-semibold">
                2024年9月4日
              </div>
              <div className="text-center text-base text-gray-500 mb-2">
                星期三 20:48
              </div>
              <div className="flex justify-center items-center">
                <HeartIcon className="text-red-500 mr-2" />
                <span>连续阅读：14天</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>阅读清单</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-blue-600 hover:underline cursor-pointer">百年孤独</span>
                  <Badge variant="secondary">进行中</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-blue-600 hover:underline cursor-pointer">动物农场</span>
                  <Badge variant="outline">待读</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-blue-600 hover:underline cursor-pointer">1984</span>
                  <Badge variant="outline">待读</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>阅读统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span>本月已读</span>
                <span className="font-bold">3 本</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>年度目标</span>
                <span className="font-bold">24 / 50 本</span>
              </div>
              <Progress value={48} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>推荐书籍</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  <CarouselItem>
                    <div className="p-1">
                      <div className="flex aspect-square items-center justify-center p-6 relative">
                        <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f" alt="Book cover" className="object-cover rounded-md" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-md">
                          <h3 className="text-sm font-semibold">百年孤独</h3>
                          <p className="text-xs">加西亚·马尔克斯</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-1">
                      <div className="flex aspect-square items-center justify-center p-6 relative">
                        <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e" alt="Book cover" className="object-cover rounded-md" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-md">
                          <h3 className="text-sm font-semibold">动物农场</h3>
                          <p className="text-xs">乔治·奥威尔</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}