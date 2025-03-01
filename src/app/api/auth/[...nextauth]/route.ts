// import NextAuth from "next-auth";
// import options from "@/lib/options";

// const {handlers, auth, signIn, signOut} = NextAuth(options);
//  // const handler = NextAuth(options)

// export {handlers as GET, handlers as POST};

import NextAuth from 'next-auth/next'

import options from '@/lib/options';

const handler = NextAuth(options)

export { handler as GET, handler as POST }
