import app from "./app"
import { AppDataSource } from "./config/data-source"

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!")

        app.listen(8080, () => {
            console.log("Server started on port 8080")
        })
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error)
    })
