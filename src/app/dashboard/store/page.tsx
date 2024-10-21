import React from 'react';
import { MessageCircle, Star, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const AppStore = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Idea Store</h1>
        <div className="flex items-center">
          <Input className="w-64 mr-4" placeholder="Search" />
          <Button variant="outline">Create</Button>
        </div>
      </header>

      <section className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 mb-8 flex items-center justify-between">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-4">🚀 探索新世界，下载最热门的 App</h2>
          <p className="mb-4">发现创新应用，体验前沿科技，让你的设备焕发新生。</p>
          <Button variant="secondary">立即探索</Button>
        </div>
        <img src="/logo.png" alt="Featured App" className="rounded-lg shadow-lg" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "带娃识字的卡片神器", description: "我可以帮你生成很好看的汉字卡片，可以带娃一起识字啦。汉字、读音、笔画、组词、造句，一次都秒了！现在就可以发送命令获得你想要的卡片吧", downloads: "229", comments: "501", favorites: "19", author: "韦恩W", authorId: "wayne2012", category: "教育" },
          { name: "健康追踪", description: "智能监测，保持健康", downloads: "890", comments: "320", favorites: "45", author: "李四", authorId: "lisi", category: "健康" },
          { name: "学习助手", description: "AI驱动，提升效率", downloads: "2500", comments: "780", favorites: "120", author: "王五", authorId: "wangwu", category: "教育" },
          { name: "音乐流媒体", description: "海量音乐，随心听", downloads: "5700", comments: "1200", favorites: "350", author: "赵六", authorId: "zhaoliu", category: "娱乐" },
          { name: "摄影大师", description: "专业修图，一键美化", downloads: "3100", comments: "650", favorites: "180", author: "孙七", authorId: "sunqi", category: "摄影" },
          { name: "新闻聚合", description: "实时资讯，定制阅读", downloads: "1800", comments: "420", favorites: "75", author: "周八", authorId: "zhouba", category: "新闻" },
        ].map((app, index) => (
          <Card key={index} className="flex flex-col hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 rounded-lg">
                  <AvatarImage src={`/logo.png`} />
                  <AvatarFallback>{app.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Avatar className="w-3.5 h-3.5">
                      <AvatarImage src={`/avatar/${app.authorId}.png`} />
                      <AvatarFallback>{app.author[0]}</AvatarFallback>
                    </Avatar>
                    <CardDescription className="text-xs">
                      <span className="font-medium">{app.author}</span> @{app.authorId}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm line-clamp-3">{app.description}</p>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between items-center p-2">
              <div className="flex items-center gap-4 ml-2 space-x-2">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{app.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{app.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{app.favorites}</span>
                </div>
              </div>
              <Avatar className="w-4 h-4">
                <AvatarImage src={`/platform/${app.category}.png`} />
                <AvatarFallback>{app.category[0]}</AvatarFallback>
              </Avatar>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppStore;