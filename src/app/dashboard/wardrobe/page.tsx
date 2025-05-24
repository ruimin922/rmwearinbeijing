"use client"

import React, { useRef, useState, useEffect } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

interface ClothingItem {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  season: string[];
  tags: string[];
}

const defaultItems: ClothingItem[] = [
  {
    id: 1,
    imageUrl: "/clothes/tshirt.jpg",
    name: "白色T恤",
    category: "上衣",
    season: ["春", "夏", "秋"],
    tags: ["基础款", "百搭", "休闲"],
  },
  {
    id: 2,
    imageUrl: "/clothes/jeans.jpg",
    name: "牛仔裤",
    category: "裤装",
    season: ["春", "秋"],
    tags: ["基础款", "百搭", "休闲"],
  },
  {
    id: 3,
    imageUrl: "/clothes/jacket.jpg",
    name: "风衣",
    category: "外套",
    season: ["春", "秋"],
    tags: ["正式", "商务", "保暖"],
  },
  {
    id: 4,
    imageUrl: "/clothes/shoes.jpg",
    name: "运动鞋",
    category: "鞋履",
    season: ["春", "夏", "秋", "冬"],
    tags: ["运动", "休闲", "舒适"],
  },
];

const categories = ["上衣", "裤装", "外套", "鞋履"];
const seasons = ["春", "夏", "秋", "冬"];

const TAG_OPTIONS = ["休闲", "运动", "通勤", "正式", "户外", "家居"];

const supabase = createSupabaseClient(
  'https://hpiptcajmzkxwbgdllwh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaXB0Y2FqbXpreHdiZ2RsbHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDQ2NzAsImV4cCI6MjA2MzU4MDY3MH0.oTo-PUVq-UhBJAPFV39r-VYynhXkH3w018zS2csir1o'
);

const WardrobePage = () => {
  const { user } = useUser();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<ClothingItem | null>(null);
  const [previewItem, setPreviewItem] = useState<ClothingItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    season: [] as string[],
    tags: [] as string[],
    imageUrl: "",
    file: null as File | null,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    category: categories[0],
    season: [] as string[],
    tags: [] as string[],
    imageUrl: "",
    file: null as File | null,
    id: null as number | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => setShowAdd(true);
  const handleCloseAdd = () => {
    setShowAdd(false);
    setForm({ name: "", category: categories[0], season: [], tags: [], imageUrl: "", file: null });
  };
  const handleFormChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "season" && type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        season: checked
          ? [...prev.season, value]
          : prev.season.filter((s) => s !== value),
      }));
    } else if (name === "file" && fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];
      if (file) {
        // 上传到 supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('clothes')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) {
          alert('图片上传失败');
          return;
        }
        const { data: publicUrlData } = supabase.storage.from('clothes').getPublicUrl(fileName);
        setForm((prev) => ({ ...prev, file, imageUrl: publicUrlData.publicUrl }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 拉取衣物列表
  const fetchClothes = async () => {
    if (!user?.id) return;
    const res = await fetch(`/api/clothes?user_id=${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setItems(
        data.map((item: any) => ({
          id: item.id,
          imageUrl: item.image_url,
          name: item.name,
          category: item.category,
          season: item.season,
          tags: item.tags,
        }))
      );
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || form.season.length === 0 || !form.imageUrl || !user?.id) return;
    const payload = {
      name: form.name,
      category: form.category,
      season: form.season,
      tags: form.tags,
      image_url: form.imageUrl,
      user_id: user.id,
    };
    const res = await fetch('/api/clothes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      fetchClothes();
      handleCloseAdd();
    } else {
      alert('添加失败');
    }
  };
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/clothes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchClothes();
    } else {
      alert('删除失败');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">我的衣柜</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 添加衣物
        </Button>
      </div>
      {/* 添加衣物弹窗 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white rounded-lg p-8 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-2">添加衣物</h2>
            <Input
              name="name"
              placeholder="衣物名称"
              value={form.name}
              onChange={handleFormChange}
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {seasons.map((season) => (
                <label key={season} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="season"
                    value={season}
                    checked={form.season.includes(season)}
                    onChange={handleFormChange}
                  />
                  {season}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <label key={tag} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag}
                    checked={form.tags.includes(tag)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setForm(prev => ({
                        ...prev,
                        tags: checked
                          ? [...prev.tags, tag]
                          : prev.tags.filter((t: string) => t !== tag),
                      }));
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept="image/*"
              className="w-full"
              onChange={handleFormChange}
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="预览" className="w-32 h-32 object-cover rounded mx-auto" />
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseAdd}>取消</Button>
              <Button type="submit">添加</Button>
            </div>
          </form>
        </div>
      )}
      {/* 编辑衣物弹窗 */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white rounded-lg p-8 w-full max-w-md space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!editForm.name || !editForm.category || editForm.season.length === 0 || !editForm.imageUrl || !user?.id) return;
            const payload = {
              name: editForm.name,
              category: editForm.category,
              season: editForm.season,
              tags: editForm.tags,
              image_url: editForm.imageUrl,
            };
            const { error } = await supabase
              .from('clothes')
              .update(payload)
              .eq('id', editForm.id);
            if (!error) {
              setEditItem(null);
              fetchClothes();
            } else {
              alert('保存失败');
            }
          }}>
            <h2 className="text-xl font-bold mb-2">编辑衣物</h2>
            <Input
              name="name"
              placeholder="衣物名称"
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <select
              name="category"
              value={editForm.category}
              onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {seasons.map((season) => (
                <label key={season} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="season"
                    value={season}
                    checked={editForm.season.includes(season)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setEditForm(f => ({
                        ...f,
                        season: checked
                          ? [...f.season, season]
                          : f.season.filter((s: string) => s !== season),
                      }));
                    }}
                  />
                  {season}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <label key={tag} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag}
                    checked={editForm.tags.includes(tag)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setEditForm(f => ({
                        ...f,
                        tags: checked
                          ? [...f.tags, tag]
                          : f.tags.filter((t: string) => t !== tag),
                      }));
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
            <input
              ref={editFileInputRef}
              type="file"
              name="file"
              accept="image/*"
              className="w-full"
              onChange={async (e) => {
                if (editFileInputRef.current && editFileInputRef.current.files) {
                  const file = editFileInputRef.current.files[0];
                  if (file) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}.${fileExt}`;
                    const { data, error } = await supabase.storage
                      .from('clothes')
                      .upload(fileName, file, { cacheControl: '3600', upsert: false });
                    if (error) {
                      alert('图片上传失败');
                      return;
                    }
                    const { data: publicUrlData } = supabase.storage.from('clothes').getPublicUrl(fileName);
                    setEditForm(f => ({ ...f, file, imageUrl: publicUrlData.publicUrl }));
                  }
                }
              }}
            />
            {editForm.imageUrl && (
              <img src={editForm.imageUrl} alt="预览" className="w-32 h-32 object-cover rounded mx-auto" />
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditItem(null)}>取消</Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </div>
      )}
      {/* 衣物展示区 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="relative group overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-t" />
            <CardContent className="p-4">
              <div className="font-bold text-lg mb-1">{item.name}</div>
              <div className="text-xs text-gray-500 mb-2">{item.category} | {item.season.join('、')}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="icon" variant="outline" onClick={() => setPreviewItem(item)} aria-label="查看详情">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => {
                  setEditItem(item);
                  setEditForm({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    season: item.season,
                    tags: item.tags,
                    imageUrl: item.imageUrl,
                    file: null,
                  });
                }} aria-label="编辑">
                  编辑
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id.toString())} aria-label="删除">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 衣物详情弹窗 */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm">
            <img src={previewItem.imageUrl} alt={previewItem.name} className="w-full h-64 object-cover rounded mb-4" />
            <div className="font-bold text-xl mb-2">{previewItem.name}</div>
            <div className="mb-2">分类：{previewItem.category}</div>
            <div className="mb-2">季节：{previewItem.season.join('、')}</div>
            <div className="mb-2">标签：{previewItem.tags.join('、')}</div>
            <Button className="mt-4 w-full" onClick={() => setPreviewItem(null)}>关闭</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardrobePage; 