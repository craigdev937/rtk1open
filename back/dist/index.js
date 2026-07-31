import { App } from "./app.js";
const port = process.env.PORT;
App.listen(port, () => {
    console.log(`Server 🌎 : http://localhost:${port}`);
    console.log("Press Ctrl + C to exit.");
});
