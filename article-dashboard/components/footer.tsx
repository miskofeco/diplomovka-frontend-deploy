import Link from "next/link"
import { Coffee, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-coffee-100 border-t border-coffee-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Coffee className="h-6 w-6 text-coffee-700" />
              <span className="ml-2 text-xl text-coffee-900 font-heading">Denná šálka kávy</span>
            </Link>
            <p className="mt-2 text-coffee-700 text-sm">
              Vaše denné spravodajstvo v jednej šálke
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-2">
              <a 
                href="https://github.com/michal-feco/diplomovka-kod" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-coffee-700 hover:text-coffee-900 transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub Repository</span>
              </a>
            </div>
            <p className="text-coffee-700 text-sm">
              © {new Date().getFullYear()} <span className="font-semibold">Bc. Michal Fečo</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}