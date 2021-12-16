import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import AuthorModel from "../services/authors/schema.js"
import { JWTAuthenticate } from "./tools.js"

const googleCloudStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      // This callback is executed when Google gives us a successful response
      // We are receiving also some informations about the user from Google (profile, email)

      console.log("GOOGLE PROFILE: ", profile)

      // 1. Check if the author is already in our db
      const author = await AuthorModel.findOne({ googleId: profile.id })

      if (author) {
        // 2. If the author is already there --> create some tokens for him/her
        const tokens = await JWTAuthenticate(author)
        // 4. passportNext()
        passportNext(null, { tokens })
      } else {
        // 3. If it is not --> add author to db and then create some tokens for him/her

        const newAuthor = new AuthorModel({
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        })

        const savedAuthor = await newAuthor.save()

        const tokens = await JWTAuthenticate(savedAuthor)

        // 4. passportNext()
        passportNext(null, { tokens })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data)
})

export default googleCloudStrategy