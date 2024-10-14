import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for the application cards
const apps = [
  {
    id: 1,
    title: "线条动物",
    description: "输入动物名称，生成简约独特的线条动物",
    icon: "/logo.svg?height=64&width=64",
    author: { name: "Creator", avatar: "/logo.svg?height=24&width=24" },
    stats: { views: "1.39k", likes: "2.5k", comments: "248" }
  },
  {
    id: 2,
    title: "看图识字",
    description: "幼儿园小朋友看图识字",
    icon: "/logo.svg?height=64&width=64",
    author: { name: "Author", avatar: "/logo.svg?height=24&width=24" },
    stats: { views: "840", likes: "1.1k", comments: "22" }
  },
  // Add more mock data for other apps...
]

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">广场</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="overflow-hidden flex flex-col">
            <CardContent className="p-4 flex-grow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={app.icon}
                    alt={app.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{app.title}</h2>
                  <div className="flex items-center space-x-2 mb-2">
                    <Link
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {app.author.name}
                    </Link>
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={app.author.avatar} alt={app.author.name} />
                      <AvatarFallback>{app.author.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-sm text-gray-600">{app.description}</p>
                </div>
              </div>
            </CardContent>
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-xs text-gray-500 mt-auto">
              <span>{app.stats.views} 浏览</span>
              <span>{app.stats.likes} 喜欢</span>
              <span>{app.stats.comments} 评论</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}