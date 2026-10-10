import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { FileQuestion, ArrowRight, Home } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 lg:py-32 px-6 sm:px-10 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#EFEADF] border border-[#CFC7B6] mx-auto flex items-center justify-center text-[#17323A]">
          <FileQuestion className="w-7 h-7 text-[#B8864B]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            404 · Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#17323A]">
            This page does not exist.
          </h1>
          <p className="text-sm text-[#4A5755]">
            The route you requested could not be located in this prototype. You can return to the home page or browse the service store.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
          <Link to="/store">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              Browse Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
