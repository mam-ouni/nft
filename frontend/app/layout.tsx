import { Web3Provider } from '@/components/Web3Provider'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {
          
        }
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}