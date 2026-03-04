import { Web3Provider } from '@/components/Web3Provider'
import './globals.css';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        
        {
          
        }
        <Web3Provider>
          <Sidebar />
          <div className="flex-1 pl-72"> 
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  )
}