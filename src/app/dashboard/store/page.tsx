import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Star, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">应用商店</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="搜索应用"
                className="pl-10 pr-4 py-2 w-64 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <Button variant="outline" className="rounded-full">
              <MapPin className="mr-2 w-4 h-4" /> 分类
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Item */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/logo.svg" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-xs">免费</Badge>
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">AI 知识库</CardTitle>
              <div className="text-sm text-gray-500">
                <span>作者：智慧先生</span>
                <span className="ml-2">ID: wisdom123</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">通过 AI 工具和系统发现洞察和知识。</p>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="bg-gray-200 rounded-full px-2 py-1">AI</span>
                <span className="bg-gray-200 rounded-full px-2 py-1">知识</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>108 次使用</span>
                <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" /> 4.5</span>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
            </CardFooter>
          </Card>

          {/* Card Item */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/logo.png" alt="ET" />
                  <AvatarFallback>ET</AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-xs">热门</Badge>
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">表情符号翻译器</CardTitle>
              <div className="text-sm text-gray-500">
                <span>作者：表情大师</span>
                <span className="ml-2">ID: emoji_master</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">将文本即时转换为表情符号，实现有趣的交流。</p>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="bg-gray-200 rounded-full px-2 py-1">表情</span>
                <span className="bg-gray-200 rounded-full px-2 py-1">翻译</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>6.1k 次使用</span>
                <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" /> 4.8</span>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
            </CardFooter>
          </Card>

          {/* Card Item */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/next.svg" alt="CC" />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-xs">新品</Badge>
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">漫画创作工具</CardTitle>
              <div className="text-sm text-gray-500">
                <span>作者：漫画创作者</span>
                <span className="ml-2">ID: comic_creator</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">使用简单的拖放功能创建个性化漫画。</p>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="bg-gray-200 rounded-full px-2 py-1">漫画</span>
                <span className="bg-gray-200 rounded-full px-2 py-1">创作</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>671k 次使用</span>
                <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" /> 4.9</span>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
            </CardFooter>
          </Card>

          {/* Card Item */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/logo.svg" alt="MB" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-xs">推荐</Badge>
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">MBTI 游戏探索器</CardTitle>
              <div className="text-sm text-gray-500">
                <span>作者：性格探索家</span>
                <span className="ml-2">ID: mbti_explorer</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">通过有趣的小游戏和活动探索你的 MBTI 性格。</p>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="bg-gray-200 rounded-full px-2 py-1">MBTI</span>
                <span className="bg-gray-200 rounded-full px-2 py-1">游戏</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>496 次使用</span>
                <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" /> 4.7</span>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
            </CardFooter>
          </Card>

        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white p-4 shadow-md">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>&copy; 2024 应用商店. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
}
