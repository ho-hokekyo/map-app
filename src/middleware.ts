import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    // 認可に関する処理。
    authorized: ({ token }) => {
      console.log("token role", token?.role)
      return token?.role === "admin" // "admin"
    },
  },
  // リダイレクトページ
  pages: {
    signIn: '/login',
  },
})

export const config = {
  // ルートとregister・api・loginはリダイレクト対象から外す

  // register・api・login,root, galleryはリダイレクト対象から外す
  // matcher: ['/((?!register|api|login|gallery).*)'],
  matcher: ['/((?!register|api|login).*)'],
}

/*
セキュリティ上の問題があるみたい
-> Next.jsのMiddlewareで認証している方はすぐに確認を！認可バイパス脆弱性（CVE-2025-29927）の解説と対策: https://qiita.com/suin/items/b71c8b5ae0ef63d04479

*/