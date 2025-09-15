import './globals.css'

export const metadata = {
  title: 'Telegram Web App Bot',
  description: 'A Telegram web app with tasks and pixel rewards',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        {children}
      </body>
    </html>
  )
}
