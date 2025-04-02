export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) throw new Error('No user found')
        if (!(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error('Invalid password')
        }
        
        return { id: user.id, email: user.email }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}) 