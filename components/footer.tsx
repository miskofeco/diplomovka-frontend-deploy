import Link from "next/link"
import Image from "next/image"
import { Coffee, Github } from "lucide-react"
import { ContentContainer } from "./content-container"

export function Footer() {
  return (
    <footer className="bg-zinc-100 border-t border-zinc-300">
      <ContentContainer>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Link href="/" className="hidden md:flex">
                <div className="relative w-45 h-4">
                  <Image 
                    src="/press-logo-simple.png" 
                    alt="Pressence" 
                    width={120}
                    height={10}
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            <p className="mt-2 text-zinc-700 text-sm">
              Vaše denné spravodajstvo na jednom mieste.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-2">
              <a 
                href="https://github.com/michal-feco/diplomovka-kod" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub Repository</span>
              </a>
            </div>
            <p className="text-zinc-700 text-sm">
              © {new Date().getFullYear()} <span className="font-semibold">Bc. Michal Fečo</span>
            </p>
          </div>
        </div>
      </div>
    </ContentContainer>
    </footer>
  )
}