import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WelcomeComponent() {
  return (
    <div className="flex flex-col items-center justify-center w-[1920px] h-[861px] bg-gray-100">
      <div className="mb-8">
        <img 
          src="https://images.unsplash.com/photo-1695653422715-991ec3a0db7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Welcome Image" 
          className="w-[600px] h-[400px] object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="space-y-4 w-[400px]">
        <Input type="text" placeholder="Enter your name" className="w-full" />
        <Input type="email" placeholder="Enter your email" className="w-full" />
        <Button className="w-full">Confirm</Button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Current time: 2024/9/5 21:47:26</p>
      </div>
    </div>
  )
}