'use client'

import React, { useState, useMemo } from 'react';
import { Download, Image, Star, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const works = [
    { id: 1, imageUrl: "https://cdn.pixabay.com/photo/2023/11/07/06/52/forest-8371211_1280.jpg", title: "森林风光", author: "自然爱好者", downloads: 1200, likes: 350, tags: ["森林", "自然", "风景"] },
    { id: 2, imageUrl: "https://cdn.pixabay.com/photo/2024/07/03/15/40/beauty-8870258_1280.png", title: "可爱小狗", author: "宠物摄影师", downloads: 980, likes: 420, tags: ["狗", "宠物", "可爱"] },
    { id: 3, imageUrl: "https://cdn.pixabay.com/photo/2022/07/21/12/37/fashion-7336161_1280.jpg", title: "山川美景", author: "风景摄影师", downloads: 1500, likes: 580, tags: ["山", "风景", "自然"] },
    { id: 4, imageUrl: "https://cdn.pixabay.com/photo/2023/08/19/19/12/leaves-8201050_1280.jpg", title: "人物肖像", author: "人像摄影师", downloads: 850, likes: 290, tags: ["人像", "摄影", "艺术"] },
    { id: 5, imageUrl: "https://cdn.pixabay.com/photo/2023/05/02/12/02/flower-7965085_1280.jpg", title: "花卉特写", author: "微距摄影师", downloads: 720, likes: 310, tags: ["花", "微距", "自然"] },
    { id: 6, imageUrl: "https://cdn.pixabay.com/photo/2016/11/22/21/49/lilies-1850750_1280.jpg", title: "飞鸟掠影", author: "野生动物摄影师", downloads: 1100, likes: 480, tags: ["鸟", "野生动物", "自然"] },
  ];

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    works.forEach(work => work.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [works]);

  const filteredWorks = useMemo(() => {
    if (!selectedTag) return works;
    return works.filter(work => work.tags.includes(selectedTag));
  }, [works, selectedTag]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">工作台</h1>
        <div className="flex items-center">
          <Input className="w-64 mr-4" placeholder="搜索" />
          <Button variant="outline">创建</Button>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {filteredWorks.map((work) => (
          <div key={work.id} className="break-inside-avoid mb-4">
            <div className="relative group overflow-hidden rounded-lg">
              <img src={work.imageUrl} alt={work.title} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-lg font-semibold">{work.title}</p>
                <p className="text-white text-sm">{work.author}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-white text-xs flex items-center">
                    <Download className="h-3 w-3 mr-1" /> {work.downloads}
                  </span>
                  <span className="text-white text-xs flex items-center">
                    <Star className="h-3 w-3 mr-1" /> {work.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;