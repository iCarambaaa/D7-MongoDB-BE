import createHttpError from "http-errors"
import atob from "atob"
import AuthorModel from "../services/authors/schema.js"

export const basicAuthMiddleware = async (req, res, next) => {
    // We are going to receive something like --> Basic c3RlZmFub0BtaWNlbGkuY29tOnN0ZWZhbm8xMjM=

    // 1. Check if Authorization header is provided, if it is not --> trigger an error (401)
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide credentials in the Authorization header!"))
  } else {
    // 2. If we have received the Authorization header, we will need to extract the credentials from it (which is base64 encoded, therefore we should translate that obtaining normal text)
    const base64Credentials = req.headers.authorization.split(" ")[1]
    const decodedCredentials = atob(base64Credentials)

    const [email, password] = decodedCredentials.split(":")

    // 3. Once we obtain the credentials (stefano@miceli.com:stefano123), we should find the author in db (by email), compare received password with the hashed one, if they are not OK --> trigger an error (401)
    const author = await AuthorModel.checkCredentials(email, password)

    if (author) {
      // 4. If the credentials are fine, we can proceed to what is next (another middleware or route handler)
      req.author = author // we are attaching to the request the author document
      next()
    } else {
      // 5. If author is not found in db OR password not correct --> trigger an error(401)
      next(createHttpError(401, "Credentials are not correct!"))
    }
  }
}

