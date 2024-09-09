'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const { updateUser } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                updateUser({ id: data.userId, email }) // 更新用户状态
                router.push('/')
            } else {
                const data = await response.json()
                setError(data.error || '登录失败')
            }
        } catch (error) {
            setError('登录过程中发生错误')
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
            <h1 className="text-4xl font-bold mb-8">登录</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <Input
                    type="email"
                    placeholder="邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4"
                />
                <Input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4"
                />
                <Button type="submit" className="w-full mb-4">登录</Button>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <p className="text-sm text-center">
                    没有账号？ <Link href="/register" className="text-blue-500 hover:underline">注册</Link>
                </p>
            </form>
        </div>
    )
}