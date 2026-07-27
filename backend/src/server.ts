import app from "./app";
import prisma from "./config/prisma";
import { env } from "./config/env";

const PORT = env.PORT;

async function startServer(){

  try{

    const connection  = await prisma.$connect();
    

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch(err){
    console.error(err);
  }
}

startServer();


