import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);
const clientPromise = client.connect();

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database" as const,
  },
};
